(function (window, dataService) {
  let name = 'Tom'

  function showMsg() {
    alert(dataService.getMsg() + ', ' + name)
  }

  window.alerter = {showMsg}
})(window, dataService)