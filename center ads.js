;(function centerAds() {
  function isMobile() {
    let mobileReg = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return mobileReg.test(navigator.userAgent)
  }
    if (isMobile()) {
      let gptDivs = document.querySelectorAll('div[id^=div-gpt-ad-]')
        , screenWidth = window.innerWidth
      MutationObserver = window.MutationObserver || window.WebKitMutationObserver

      function centerAd(gptDiv) {
        let adContainer = gptDiv.firstElementChild && gptDiv.firstElementChild.firstElementChild
          // , adWidth = adContainer ? adContainer.offsetWidth : undefined
          , containerWidth = gptDiv.parentNode.offsetWidth
          , containerMargin = screenWidth - containerWidth
          , newMargin = Math.floor((0 - Math.abs(containerMargin)) / 2)
        gptDiv.style.marginLeft = newMargin + 'px'
        gptDiv.style.width = screenWidth + 'px'
      }

      for (let div of gptDivs) {
        centerAd(div)
        try {
          let observer = new MutationObserver(function (mutations, observer) {
            for (let mut of mutations) {
              if (mut.target.parentNode.firstElementChild.tagName == 'IFRAME') {
                centerAd(mut.target.parentNode.parentNode)
              }
            }
          })

          observer.observe(div, {
            attributes: true,
            subtree: true
          })
        } catch (e) { }
      }
    }
  })()