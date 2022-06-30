# gam-adunits-injection
The script is used to inject Google Ad Manager ad unit body tags to the article text. It injects sidebar ad units on mobile also to improve viewability.

Related work:
https://github.com/chupe/adx-site-check-ce
https://github.com/chupe/check-gpt-tags

# how to

Main function is in gam ad units injection.js with some additional helper functions for ads setup.

The function injects ad units inside the target element (postSelector).

injectionOptions is used for configuring the injection of ad units.
Mandatory is postSelector and at least one of the following: belowArticle,
middleOfArticle, underArticle, sideAds.

spacing option is used to determine number of words after which the ad
should be inserted, use 'auto' to calculate this dinamicaly
mobileSpacing is used on mobile  
preventMultipleInsertions will modify global boolean named adInsertionComplete
after the insertion completes for the first time. Used for inf scroll sites.
imageParagraphSequence is the sequence of the paragraph containing the intro
image of the article.
mobileImageParagraph overrides imageParagraphSequence if device is mobile.
HTMLBefore contains custom HTML to be inserted before each ad. Example:
'Text is continued after the ad'
centerAds will autocenter all divs starting with 'div-gpt-ad'. Does not
always produce optimal results, check before use
underArticleMethod ('write', 'insert') selects the way for injecting the
underArticle ad units. 'write' method uses document.write to inject the code
at the place of insertion of the script. 'insert' targets the last paragraph
of the article and inserts the ad units under it.
contentElements counts all elements if 'all' is passed as value or only paragraphs
if 'paragraphs' is passed as a value
debug will turn on logs in the console about the state of the script

ad unit takes form of an object with properties 'id' and 'options'.
Id is the div id of the ad unit.
Options is an object that takes as properties names of style attributes to be
applied to the ad unit element.

Desktop
belowImage (ad unit) will be inserted after the imageParagraph. (double check)
middleOfArticle ([ad units]) will be be inserted after spacing number of words. Can be
single ad unit or an array.
underArticle ([ad units]) will be inserted using underArticleMethod
method. Use in combinations with options to adjust 2 rectangles side by side below
article.

Mobile
belowImage - same as desktop.
middleOfArticle - same as desktop but spacing is modifited by mobileSpacing.
sideAds are injected after spacing number of words.
underArticle is injected after spacing number of words, if not than it
is injected using document write at place of insertion of the script.
