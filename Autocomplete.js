import xhrAdapter from './xhrAdapter.js'

export default class Autocomplete {
  constructor (rootEl, options = {}) {
    options = Object.assign({ maxResults: 10,
      data: null,
      url: null,
      query: null,
      errorHandler: null,
      threshold: 3
    }, options)
    Object.assign(this, { rootEl, options })

    this.init()
  }

  onQueryChange (query) {
    // Get data for the dropdown
    let results
    if (this.options.data) {
      results = this.getResults(query)
      results = results.slice(0, this.options.maxResults)
      this.updateDropdown(results)
    } else {
      results = this.fetchResults(query)
    }
  }

  /**
   * Build a query string for a search keyword like
   * http://.../api/v1/people?q= where q is defined in
   * options.query and url in options.url
   *
   * @param {*} word
   */
  queryString (word) {
    let o = this.options
    let url = o.url + '?' + o.query + '=' + word
    if (o.queryMax && o.maxResults) {
      url = url + '&' + o.queryMax + '=' + o.maxResults
    }

    return url
  }

  /**
   * Prepare an url and call xhr promise
   *
   * @param {*} query the keyword
   */
  fetchResults (word) {
    // basic rate limit protection
    if (word.length <= this.options.threshold) return
    var url = this.queryString(word)
    var me = this

    // Warning use of custom/untested xhrAdapter for challenge purpose
    // in production please use a library like Axios
    xhrAdapter('GET', url, null, 10000)
      .then(function (jsonResponse) {
        if (jsonResponse) {
          if (me.options.transform instanceof Function) {
            me.updateDropdown(me.options.transform(jsonResponse))
          }
        }
      })
      .catch(function (error) {
        if (me.options.errorHandler) {
          me.options.errorHandler(error)
        }
      })
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults (query) {
    let data = this.options.data
    if (!query) return []
    if (this.options.transform instanceof Function) {
      data = this.options.transform(data)
    }
    let results = data.filter((item) => {
      return item.value.toLowerCase().includes(query.toLowerCase())
    })

    return results
  }

  updateDropdown (results) {
    this.idx = -1
    this.listEl.innerHTML = ''

    this.listEl.appendChild(this.createResultsElem(results))
  }

  createResultsElem (results) {
    const fragment = document.createDocumentFragment()
    results.forEach((result) => {
      const el = document.createElement('li')
      Object.assign(el, {
        className: 'result',
        textContent: result.value
      })
      el.setAttribute('data-value', result.key)

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        const { onSelect } = this.options
        if (typeof onSelect === 'function') {
          onSelect(result)
        }
        this.inputElem.value = result.value
      })

      fragment.appendChild(el)
    })

    return fragment
  }

  /**
   * Key pressed on the input element
   *
   * @param {*} e
   */
  onKeyUp (e) {
    var results = document.getElementsByClassName('result')
    for (var i = 0; i < results.length; i++) {
      results[i].classList.remove('selected')
    }
    switch (e.keyCode) {
      case 38: // keyup
        if (this.idx > 0) {
          this.idx--
        } else {
          this.idx = results.length - 1
        }
        break
      case 40: // key down
        if (this.idx < results.length - 1) {
          this.idx++
        } else {
          this.idx = 0
        }
        break
      case 13: // enter
        results[this.idx].click()
        break
      default:
        let me = this
        let e = event
        clearTimeout(this.timeout)
        this.timeout = setTimeout(function () {
          me.onQueryChange(e.target.value)
        }, 400)
    }

    if (this.idx > -1) {
      results[this.idx].classList.add('selected')
      results.scrollIntoView(true)
    }
  }

  createQueryinputElem () {
    const inputElem = document.createElement('input')
    Object.assign(inputElem, {
      type: 'search',
      name: 'query',
      autocomplete: 'off'
    })
    inputElem.addEventListener('keyup', event =>
      this.onKeyUp(event))

    return inputElem
  }

  init () {
    // Build query input
    this.inputElem = this.createQueryinputElem()
    this.rootEl.appendChild(this.inputElem)
    this.idx = -1
    this.timeout = null
    // Build results dropdown
    this.listEl = document.createElement('ul')
    Object.assign(this.listEl, { className: 'results' })

    this.rootEl.appendChild(this.listEl)
  }
}
