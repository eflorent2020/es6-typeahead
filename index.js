import Autocomplete from './Autocomplete'
import usStates from './us-states'
import './main.css'

/* eslint-disable no-new */
new Autocomplete(document.getElementById('state'), {
  data: usStates,
  transform: (data) => {
    return data.map(state => Object.assign({key: state.abbreviation, value: state.name}, {}))
  },
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode)
  }
})

// Github Users
/* eslint-disable no-new */
//     query: 'q',
new Autocomplete(document.getElementById('gh-user'), {
  url: 'https://api.github.com/search/users',
  query: 'q',
  queryMax: 'per_page',
  maxResults: 6,
  threshold: 3,
  transform: (data) => {
    return data.items.map(user => Object.assign({key: user.id, value: user.login}, user))
  },
  errorHandler: (error) => {
    document.getElementById('error').innerHTML = error
    setTimeout(function () {
      document.getElementById('error').innerHTML = ''
    }, 5000)
  },
  onSelect: (ghUserId) => {
    document.getElementById('error').innerHTML = ''
    document.getElementById('avatar').src = ghUserId.avatar_url
    document.getElementById('user').innerHTML = ghUserId.login
    document.getElementById('user').href = ghUserId.html_url
    console.log(ghUserId)
  }
})
