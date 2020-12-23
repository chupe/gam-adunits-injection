let type = '', category = '', subcategory = '', path = new URL(document.URL).pathname, arr = path.split('/'), len = arr.length
while (arr.indexOf('') > -1) arr.splice(arr.indexOf(''), 1)
if (path === '' || path === '/') type = 'homepage'
else {
  for (let section of arr) {
    if (section === 'category') {
      type = 'category'
      category = arr[2]
      break
    } else {
      type = 'article'
      category = arr[1]
    }
  }
}

let type = '', category = '', path = new URL(document.URL).pathname, arr = path.split('/'), len = arr.length
try {
  while (arr.indexOf('') > -1) arr.splice(arr.indexOf(''), 1)
  if (path === '' || path === '/') type = 'homepage'
  else {
    for (let section of arr) {
      if (section === 'category') {
        type = 'category'
        category = arr[1]
        break
      } else {
        type = 'article'
        let jsonLdScripts = document.querySelectorAll('script[type^="application/ld+json"]')
          , jsonLdScript = ''
        for (let node of jsonLdScripts) if (node.className === '') jsonLdScript = node
        let json = JSON.parse(jsonLdScript.innerHTML)
          , breadcrumbsUrl = json.itemListElement[1].item["@id"]
          , path2 = new URL(breadcrumbsUrl).pathname, arr2 = path2.split('/')
        category = arr2[2]
      }
    }
  }
} catch (e) {}

let type = '', path = new URL(document.URL).pathname, arr = path.split('/'), len = arr.length
while (arr.indexOf('') > -1) arr.splice(arr.indexOf(''), 1)
if (path === '' || path === '/') type = 'homepage'
else {
  for (let section of arr) {
    if (section === 'category') {
      type = 'category'
      category = arr[1]
      break
    } else {
      type = 'article'
    }
  }
}

let type = '', category = '', subcategory = '', path = new URL(decodeURI(document.URL)).pathname, arr = path.split('/'), len = arr.length
if (arr.slice(-1)[0] === '') arr.pop()
if (path === '' || path === '/') type = 'homepage'
else {
  for (let section of arr) {
    if (!isNaN(parseInt(section))) {
      type = 'article'
      category = arr[1]
      subcategory = arr[2]
      break
    } else {
      type = 'category'
      category = arr[1]
      subcategory = arr[2]
    }
  }
}

let type = '', category = '', subcategory = '', path = window.location.pathname, arr = path.split('/'), len = arr.length
if (arr.slice(-1)[0] === '') arr.pop()
if (path === '' || path === '/') type = 'homepage'
else {
  for (let section of arr) {
    if (len > 2) {
      type = 'article'
      category = arr[1]
      subcategory = arr[2]
      break
    } else {
      type = 'category'
      category = arr[1]
      subcategory = arr[2]
    }
  }
}

let type = '', category = '', subcategory = '', path = new URL(decodeURI(document.URL)).pathname, arr = path.split('/'), len = arr.length
if (arr.slice(-1)[0] === '') arr.pop()
if (arr[0] === '') arr.shift()
let categories = ['كرة-عربية', 'كرة-عالمية', 'دوريات-أوروبية', 'رياضات-أخرى']
if (path === '' || path === '/') type = 'homepage'
else {
  if (arr[0] === encodeURIComponent('النتائج')) {
    type = 'results'
  } else if (arr[0] === 'search') {
    type = 'search'
  } else if (arr.length <= 2 && categories.includes(decodeURIComponent(arr[0]))) {
    type = 'category'
    category = decodeURIComponent(arr[0])
    subcategory = decodeURIComponent(arr[1])
  } else if (arr[1] === encodeURIComponent('الفرق')) {
    type = 'teams'
  } else if (arr.length > 2) {
    type = 'article'
    category = decodeURIComponent(arr[0])
    subcategory = decodeURIComponent(arr[1])
  } else if (arr[0] === 'p') {
    type = 'static'
  }
}


let type = '', category = '', path = new URL(document.URL).pathname, arr = path.split('/'), len = arr.length
while (arr.indexOf('') > -1) arr.splice(arr.indexOf(''), 1)
if (path === '' || path === '/') type = 'homepage'
else {
  for (let section of arr) {
    if (section === 'category') {
      type = 'category'
      category = arr[1]
      break
    } else {
      type = 'article'
      let jsonLdScript = document.querySelector('script[type^="application/ld+json"]')
        , json = JSON.parse(jsonLdScript.innerHTML)
        , breadcrumbsUrl = json.itemListElement[1].item["@id"]
        , path2 = new URL(breadcrumbsUrl).pathname, arr2 = path2.split('/')
      category = arr2[2]
    }
  }
}