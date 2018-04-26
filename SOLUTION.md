# Solution Docs

## path

- Add ESLint to project

- Extract a function for mapping json data to key value, make it as an option/param

- Build an xhrAdapter (in production would have used Axios, for coding challenge)

- Find an way to select using key up/down/enter using the least time possible

- Add rate limit protection (threshold + keyup timeout)

- Few variable renaming

- It's always more cool with a black background and a green font

## Cool thing that could be done

- Highlight in answers the typed text

- CSS

## Usage

new Autocomplete(element, options)

Exemple

````
new Autocomplete(document.getElementById('gh-user'), {
    url: 'https://api.github.com/search/users',
    query: 'q',
    queryMax: 3
  },
  transform: (data) => {
    return data.items.map( user =>   Object.assign({key: user.id, value: user.login},{}))
  },
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId)
  }
})
````
