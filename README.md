# gam-adunits-injection
The script is used to inject Google Ad Manager ad unit body tags to the article text. It injects sidebar ad units on mobile also to improve viewability.

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
