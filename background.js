browser.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // read changeInfo data and do something with it
      // like send the new url to contentscripts.js
      if (changeInfo.url) {

        browser.tabs.sendMessage( tabId, {
          message: 'newURL',
          url: changeInfo.url
        })
      }
    }
  );

  