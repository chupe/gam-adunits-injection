/*

  The function injects ad units inside the target (postSelector).

  injectionOptions is used for configuring the injection of ad units.
  Mandatory is postSelector and at least one of the following, belowArticle,
  middleOfArticle, underArticle, sideAds.

  spacing options is used to determine number of words after which the ad
  should be inserted.
  mobileSpacing is used for when the site is loaded on mobile. 
  preventMultipleInsertions will modify global boolean named adInsertionComplete
  after the insertion completes for the first time. Used for inf scroll sites.
  imageParagraphSequence is the sequence of the paragraph containing the intro
  image of the article.
  mobileImageParagraph overrides imageParagraphSequence if device is mobile.
  HTMLBefore contains custom HTML to be inserted before each ad. Example:
  'Text is continued after the ad'
  centerAds will autocenter all divs starting with 'div-gpt-ad'. Does not
  always produce optimal results.
  underArticleMethod ('write', 'insert') selects the way for injecting the
  underArticle ad units. 'write' method uses document.write to inject the
  at the place of insertion of the script. 'insert' targets the last paragraph
  of the article and inserts the ad units under it.
  contentElements counts all elements if 'all' is passed as value or only paragraphs
  if 'paragraphs' is passed as a value

  ad unit takes form of object with properties 'id' and 'options'.
  Id is the div id of the ad unit.
  Options is an object that takes as properties names of style attributes to be
  applied to the ad unit element.

  Desktop
  belowImage (ad unit) will be inserted after the imageParagraph. (double check)
  middleOfArticle ([ad units]) will be be inserted after spacing number of words. Can be
  single ad units or an array.
  underArticle ([ad units]) will be inserted using underArticleMethod
  method.

  Mobile
  belowImage - same as desktop.
  middleOfArticle - same as desktop but spacing is modifited by mobileSpacing.
  sideAds are injected after spacing number of words.
  underArticle is injected after spacing number of words, if not than it
  is injected using document write at place of insertion of the script.

*/


injectionOptions = {
  postSelector: 'div[class^="entry-content"]',
  belowImage: {
    id: "div-gpt-ad-1589378349767-0",
    // options: {
    //   margin: '20px',
    //   float: 'left',
    //   width: '300px',
    //   heigth: '250px'
    // }
  },
  middleOfArticle: [
    {
      id: "div-gpt-ad-1589378375308-0",
    },
  ],
  underArticle: [
    {
      id: "div-gpt-ad-1589975483566-0",
    },
    // {
    //   id: "div-gpt-ad-1596098742723-0",
    // },
  ],
  sideAds: [
    {
      id: "div-gpt-ad-1589378474675-0",
    },
    {
      id: "div-gpt-ad-1589378448904-0",
    },
  ],
  spacing: 'auto', // valid choices: int, 'auto'. 'auto' determines the word spacing based on text lenght and number of ad units
  mobileSpacing: 'auto', // valid choices: int, 'auto'.'auto' determines the word spacing based on text lenght and number of ad units
  preventMultipleInsertions: false,
  imageParagraphSequence: 2,
  mobileImageParagraph: 2,
  // HTMLBefore: '<span class="td-adspot-title">Tekst se nastavlja ispod oglasa</span>',
  underArticleMethod: 'insert', // valid choices: write, insert
  contentElements: 'all', // valid options: all, paragraphs
  centerAds: true,
  // debug: true
}


  ; (function LMinject(options) {
    function inject(options) {
      let { postSelector,
        belowImage,
        middleOfArticle,
        underArticle,
        sideAds,
        spacing = 140,
        mobileSpacing = 110,
        preventMultipleInsertions = false,
        imageParagraphSequence = 1,
        mobileImageParagraph = imageParagraphSequence,
        underArticleMethod = 'write',
        HTMLBefore,
        contentElements = 'paragraphs',
        centerAds = false,
        debug = false
      } = options

      if (preventMultipleInsertions === true && adInsertionComplete === true) return

      let ps, pCount, post, postElements

      post = document.querySelector(postSelector)

      try {
        if (contentElements === 'paragraphs') {
          postElements = document.querySelectorAll(postSelector + ' > p')
          pCount = postElements.length
        } else {
          // Article content selector
          postElements = post.children
        }
      } catch (e) {
        console.error('LMInject: please check post selector configuration.')
        return
      }

      function isMobile() {
        let mobileReg = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        return mobileReg.test(navigator.userAgent)
      }

      //Count word in a given string
      let wordCount = (str) => {
        return str.split(' ')
          .filter(function (n) { return n != '' })
          .length;
      }

      let elemWordCount = (elem) => {
        let includeElements = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'LI', 'P', 'DIV', '#TEXT', 'STRONG']
        let count = 0, node
        if (elem.children && elem.children.length !== 0) {
          for (let child of elem.children) {
            if (includeElements.includes(child.nodeName.toUpperCase())) {
              count += elemWordCount(child).count
              node = elemWordCount(child).node
            }
          }
        } else if (HTMLCollection.prototype.isPrototypeOf(elem)) {
          for (let child of elem) {
            if (includeElements.includes(child.nodeName.toUpperCase())) {
              count += elemWordCount(child).count
              node = elemWordCount(child).node
            }
          }
        } else {
          count += wordCount(elem.textContent)
          node = elem
        }

        return { count, node }
      }

      if (spacing == 'auto') spacing = Math.round(elemWordCount(post).count / (middleOfArticle.length + 1))
      
      //Use mobileSpacing for spacing on mobile
      let imageParagraph
      if (isMobile()) {
        spacing = mobileSpacing
        if (mobileSpacing == 'auto') spacing = Math.round(elemWordCount(post).count / (middleOfArticle.length + sideAds.length + 1))
        imageParagraph = mobileImageParagraph
      } else {
        imageParagraph = imageParagraphSequence
      }

      if (debug)
        console.log(elemWordCount(post), spacing)

      //Generate ad unit HTML elements. Parameter is object with id and options
      //fields. Options is an object containing div.style.attribute names of
      //CSS to be applied inline to the element.
      let generateAdUnit = (gpt) => {
        let { options = {} } = gpt
        let {
          margin = '10px auto',
          textAlign = 'center',
        } = options

        let gptDiv = document.createElement("div"), scriptDiv = document.createElement("script")
        gptDiv.id = gpt.id

        let addDefaults = () => {
          gptDiv.style.margin = margin
          gptDiv.style.textAlign = textAlign
        }

        let addInnerHTML = () => {
          scriptDiv.innerHTML = 'googletag.cmd.push(function() { googletag.display("' + gpt.id + '"); });';
        }

        if (!isMobile()) {
          for (let style in options) {
            gptDiv.style[style] = options[style]
          }
        }

        addInnerHTML()
        addDefaults()

        gptDiv.appendChild(scriptDiv)

        return gptDiv
      }

      // Get reference paragraph to inject before or after using post.injectBefore/After.
      // Goal is that the ad units should not get injected between paragraph and its
      // heading. Parameter is the sequence of the targeted paragraph.
      let getRef = (sequence) => {
        let refP

        if (contentElements === 'paragraph') {
          refP = document.querySelector(postSelector + ' p:nth-of-type(' + sequence + ')')
        } else if (contentElements === 'all')
          refP = postElements[sequence]

        let precedingElement = refP.previousElementSibling
        if (precedingElement && precedingElement.nodeName.startsWith('H'))
          return precedingElement
        else
          return refP
      }

      //Ad custom HTML before the ad unit
      let generateCustomHtml = (adUnit) => {
        let adUnitNode = document.createElement('div')
        let customNode = document.createElement('div')
        customNode.innerHTML = HTMLBefore
        adUnitNode.prepend(customNode)
        adUnitNode.append(adUnit)

        return adUnitNode
      }

      //Inject ad unit before paragraph (insertbefore parameter is a sequence). If
      //preceding element is a an element 
      //starting with H (h1, h2, h3...) the ad will be inserted before it.
      let injectAdUnit = (gpt, insertBefore) => {
        if (typeof gpt === 'undefined') return

        let adUnit = generateAdUnit(gpt)

        if (typeof HTMLBefore !== 'undefined')
          adUnit = generateCustomHtml(adUnit)

        try {
          let refNode = getRef(insertBefore)
          post.insertBefore(adUnit, refNode)

          if (debug)
            console.log(`Injected: ${adUnit.id} after ${insertBefore} elements (${refNode.nodeName})`)
        } catch (e) {
          console.warn(`Failed to inject: ${adUnit.id} after ${insertBefore - 1} paragraphs`)
        }
      }

      let insertAfter = (newNode, existingNode) => {
        try {
          if (typeof HTMLBefore !== 'undefined')
            newNode = generateCustomHtml(newNode)

          if (typeof existingNode !== 'undefined')
            existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);

          if (debug)
            console.log(`Injected: ${newNode.id} after ${existingNode.textContent.substring(0, 15)} elements (${existingNode.nodeName})`)
        } catch (e) {
          console.warn(`Failed to inject: ${newNode.id} after ${existingNode}`)
        }
      }

      //Compile an array of ad units to be inserted. For desktop it consists
      //only of belowImage and middleOfArticle. On mobile sideAds,
      //and underArticle are also part of this array.
      let getGpts = () => {
        let gpts = []

        if (Array.isArray(middleOfArticle))
          gpts = gpts.concat(middleOfArticle)
        else if (typeof (middleOfArticle) !== 'undefined')
          gpts.push(middleOfArticle)

        if (isMobile()) {
          if (Array.isArray(sideAds))
            gpts = gpts.concat(sideAds)
          else if (typeof (sideAds) !== 'undefined')
            gpts.push(sideAds)

          if (Array.isArray(underArticle))
            gpts = gpts.concat(underArticle)
          else if (typeof (underArticle) !== 'undefined')
            gpts.push(underArticle)

          //Remove duplicates
          for (let gpt in gpts) {
            let check = false
            for (let compare in gpts) {
              if (gpt === compare) continue
              if (gpts[gpt].id === gpts[compare].id) check = true
              if (check) {
                gpts.splice(parseInt(gpt), 1)
                break
              }
            }
          }
        }

        //Remove invalid entries (no id field)
        for (let id in gpts) {
          if (gpts[id].id === "")
            gpts.splice(parseInt(id), 1)
        }

        return gpts
      }

      let gpts = getGpts()

      if (belowImage) {
        let adUnit = generateAdUnit(belowImage)
        if (debug)
          console.log('------------------ Below image inserted ------------------')

        post.insertBefore(adUnit, postElements[imageParagraph])
      }

      let spaceInsertions = (gpts) => {
        let words = 0, counter = 0
        if (contentElements === 'paragraphs') {
          postElements.forEach((paragraph, sequence) => {
            if (sequence < imageParagraph - 1) return

            let pText = paragraph.textContent

            if (typeof (pText) !== 'undefined') words += wordCount(pText)

            if (debug)
              console.log('After paragraph ' + (sequence + 1) + ' there are ' + words + ' words. ' + pText.substr(0, 20))

            if (words > spacing) {
              let insertBefore = sequence + 1
              injectAdUnit(gpts.shift(), insertBefore)
              words = 0
              counter += 1
            }
          })
        } else if (contentElements === 'all') {
          for (let sequence = 0; sequence < postElements.length; sequence++) {
            let { count, node } = elemWordCount(postElements[sequence])
            words += count

            if (debug)
              console.log('No.:' + (sequence + 1) + ', type: ' + postElements[sequence].nodeName + ', words: ' + words + ', content: ' + postElements[sequence].textContent.substr(0, 20))

            if (words > spacing) {
              if (gpts.length <= 0) return
              let adUnit = generateAdUnit(gpts.shift())

              insertAfter(adUnit, node)

              words = 0
              counter += 1
            }
          }
        }

        if (preventMultipleInsertions) adInsertionComplete = true
      }

      spaceInsertions(gpts)

      if (typeof (underArticle) !== 'undefined' && (!isMobile() || gpts.length !== 0)) {
        let underArticleCode = ''
        if (Array.isArray(underArticle) && underArticle.length > 0)
          underArticleCode = generateAdUnit(underArticle[0]).outerHTML
        else if (typeof underArticle !== 'undefined')
          underArticleCode = generateAdUnit(underArticle).outerHTML
        else return

        if (!isMobile() && Array.isArray(underArticle) && underArticle.length > 1)
          underArticleCode += generateAdUnit(underArticle[1]).outerHTML

        let insert = (code, target) => {
          let elem = document.createElement('div')
          elem.style.display = 'flex'
          elem.innerHTML = code

          if (target) {
            let node = document.querySelector(target)
            node.prepend(elem)
          } else {
            insertAfter(elem, document.querySelector(postSelector + ' p:last-of-type'))
          }
        }

        let write = (code) => {
          let elem = document.createElement('div')
          elem.style.display = 'flex'
          elem.innerHTML = code

          document.write(elem.outerHTML)
        }

        if (debug)
          console.log('------------------ Under article inserted ------------------')

        switch (underArticleMethod) {
          case 'write':
            write(underArticleCode)
            break
          case 'insert':
            insert(underArticleCode) //, 'div[class^="col-md-6 col-xs-12"]')
            break
        }

      }

      if (centerAds) {
        (function centerAds() {
          if (isMobile()) {
            let gptDivs = document.querySelectorAll('div[id^="div-gpt-ad-"]')
              , screenWidth = window.innerWidth
            MutationObserver = window.MutationObserver || window.WebKitMutationObserver

            function centerAd(gptDiv) {
              let adContainer = gptDiv.firstElementChild && gptDiv.firstElementChild.firstElementChild
                // , adWidth = adContainer ? adContainer.offsetWidth : undefined
                , containerWidth = gptDiv.parentNode.offsetWidth
                , containerMargin = screenWidth - containerWidth
                , newMargin = Math.floor((0 - Math.abs(containerMargin)) / 2)
              // if (gptDiv.id === 'div-gpt-ad-9159109-1') return
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
      }
    }

    if (options.debug) {
      inject(options)
    } else {
      try {
        inject(options)
      } catch (e) { }
    }
  })(injectionOptions);