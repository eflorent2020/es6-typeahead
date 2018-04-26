module.exports = function xhrAdapter (method, url, data, timeout) {
  return new Promise(function dispatchXhrRequest (resolve, reject) {
    var urlObject = new URL(url)
    var requestData = data // for post if any
    var request = new XMLHttpRequest()

    request.open(method, urlObject.href, true)

    // Set the request timeout in MS
    request.timeout = timeout

    // Listen for ready state
    request['onreadystatechange'] = function handleLoad () {
      if (!request || (request.readyState !== 4)) {
        return
      }

      if (request.status === 0) {
        return
      }

      // Prepare the response
      var response = {
        data: request.response,
        statusText: request.statusText,
        request: request
      }
      if (request.status >= 200 && request.status < 300) {
        try {
          let jsonResponse = JSON.parse(response.data)
          resolve(jsonResponse)
        } catch (e) {
          reject(createError(
            'Unable to parse json response ' + e,
            null,
            response.request,
            response
          ))
        }
      } else {
        reject(createError(
          'Request failed with status ' + response.statusText,
          request.status,
          response.request,
          response
        ))
      }

      // Clean up request
      request = null
    }

    request.onabort = function handleAbort () {
      if (!request) {
        return
      }

      reject(createError('Request aborted', 'ECONNABORTED', request))

      // Clean up request
      request = null
    }

    // Handle low level network errors
    request.onerror = function handleError () {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', null, request))

      // Clean up request
      request = null
    }

    // Handle timeout
    request.ontimeout = function handleTimeout () {
      reject(createError('timeout of ' + timeout + ' ms exceeded', 'ECONNABORTED', request))

      // Clean up request
      request = null
    }

    if (requestData === undefined) {
      requestData = null
    }

    // Send the request
    request.send(requestData)
  })

  function createError (error, code, request, response) {
    if (code) {
      return code + ' ' + error
    }
    return error
  }
}
