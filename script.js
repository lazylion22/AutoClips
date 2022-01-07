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
            $.notify("video ended ", "info");

            autoclipskip()
            started = 0
            
            
        
          }

      })
      videoelement.addEventListener('play', (event) => {
          //console.log('started')
          $.notify("video = play ", "info");

          started = 1

      })

      }

    } 
    else{
      if (findvideo() == videoelement){
        $.notify("same video elemnt ", "info");
        
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
  if(started ==1){
    
    //$.notify('auto', "info");
    $.notify("autoclipskip started =1", "info");
    // https://regex101.com/r/F22kJB/1
    var clip_id = window.location.href.match(/(?<=\/clip\/)(.*?)(?=-|\?)/g)
    if (clip_id){
      $.notify(`clip_id=${clip_id}`, "info");
      var allCards = document.querySelectorAll('[data-a-target^="clips-card"]')
      for (var i=0;i<allCards.length;i++){
            var ref = $(allCards[i]).find('div a:first')[0].href
            if (ref){
              //$.notify(`ref=${ref}`, "info");
              if(ref.includes(clip_id)){
                if (i+1 == allCards.length){
                  allCards[i].scrollIntoView();
                
                  var count = 0
                  // trying to load new cards for 2 sec (20time*10ms)
                  var myInterval = setInterval( function(){    
                    var newcards = document.querySelectorAll('[data-a-target^="clips-card"]')
                    if (newcards.length > allCards.length ){
                      $.notify(`Loaded new cards, newcards.length=${newcards.length}`, "info");
                      $(newcards[i+1]).find('div a:first')[0].click()
                      started = 0
                      
                      clearInterval(myInterval);

                    }
                    if (count >= 20){
                      allCards[0].scrollIntoView();

                      $.notify(`Cant load new clips`, "error");
                      // $.notify(`count = ${count} load new clips`, "error");  
                      clearInterval(myInterval);
                    }
                    count++
                  }, 100);                    
                  break;
                }
            
                else{
                  $.notify(`Clicing next card`, "info");
                  
                  setTimeout(() => {
                    $(allCards[i+1]).find('div a:first')[0].click()
                  }, 1000);
                  started = 0
                  break;
                }
              }

            }
            else{
              $.notify(`Cant find ref`, "error");
              return
            }

        }
      }
      else{
        $.notify("Cant find clip id in URL", "error");
  
      }
    }
    else{
      $.notify("autoclipskip started =0", "info");

    }
  
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