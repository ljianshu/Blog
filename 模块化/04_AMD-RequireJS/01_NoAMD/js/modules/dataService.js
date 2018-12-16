;(function(window) {
  let msg = 'www.baidu.com'

  function getMsg() {
    return msg.toUpperCase()
  }

  window.dataService = { getMsg }
})(window)
