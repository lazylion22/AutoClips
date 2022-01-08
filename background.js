var iconState = 1
function ok(){
  //console.log('tabs local.set OK')
  
}
function ok2(item){
  //console.log('bg ok2',item.state.isOn)

  iconState = item.state.isOn
  if(iconState){
    browser.browserAction.setIcon({path: "iconOn.png"});

  }
  else{
    browser.browserAction.setIcon({path: "iconOff.png"});

  }


}


function onError(error) {
    console.error(`AutoClips Error: ${error}`);
}
  


function notok2(){
  console.log('local.get ERROR')
  browser.storage.local.set({
    state: {
      isOn: 1
    }
  }).then(ok, onError );
}
browser.storage.local.get("state").then(ok2,notok2)

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

function iconClick() {
  iconState = iconState ? 0 : 1
  if(iconState){
    // state is ON
    browser.storage.local.set({
      state: {
        isOn: 1
      }
    }).then(ok, onError );
    browser.browserAction.setIcon({path: "iconOn.png"});

  }
  else{
    browser.storage.local.set({
      state: {
        isOn: 0
      }
    }).then(ok, onError );
    browser.browserAction.setIcon({path: "iconOff.png"});

  }

}
function sendMessageToTabs(tabs) {
  //console.log("tabs",tabs)

  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {
        message: 'iconState',
        state: iconState
      }).catch(onError);
  }
}
function logStorageChange(changes, area) {
  browser.tabs.query({
    url: ["https://*.twitch.tv/*"]

  }).then(sendMessageToTabs).catch(onError);

}
browser.storage.onChanged.addListener(logStorageChange);
browser.browserAction.onClicked.addListener(iconClick);