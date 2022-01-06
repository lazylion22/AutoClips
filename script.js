var clip = 0
var videoelement = 0
var started = 0

// $.notify("Access granted", "success");

function check_url(url){
  if (url.includes('/clip/')){
    $.notify("clip ", "success");
    
    console.log('clip',url) 
    clip = 1
    if (videoelement==0){
      videoelement = findvideo()
      //console.log(videoPlayer)
      if (videoelement == -1){
        $.notify("Cant find video element", "error");
        return
      }
      else{
        $.notify("found video element ", "success");

      videoelement.addEventListener('ended', (event) => {
          //console.log('ended')
          if(window.location.href.includes('/clip/')){
            started = 0
            $.notify("video ended ", "info");
            
        
          }

      })
      videoelement.addEventListener('play', (event) => {
          //console.log('started')
          $.notify("video = play ", "info");

          started = 1

      })

      }

    } 

  }
  else{
    $.notify("Not clip", "warn");
    console.log('not clip',url) 
    clip =0
    videoelement = 0

  }
}
function autoclipskip(vid){
  
}
// checks every url change
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'newURL') {
      //console.log('ASDFASDFASDF',request.url) // new url is now in content scripts!
      $.notify("New URL", "info");

      started = 0 
      check_url(request.url)


    }
});
check_url(window.location.href)
function findvideo(){
  if( document.body.getElementsByTagName("video").length > 0){
    return document.body.getElementsByTagName("video")[0]
  }
  else{
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
    let observer = new MutationObserver(mutationRecords => {
      mutationRecords.forEach(function(mutation) {
          var v = document.body.getElementsByTagName("video")
          if (v.length >0){
              //console.log('f')
              observer.disconnect()
              return v[0]

          }


      });
  });
  }
  return -1
}