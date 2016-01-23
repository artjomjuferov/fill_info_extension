var getCurrentUser = function(){
  var id = localStorage["currentUserId"];
  return id ? JSON.parse(localStorage["user"+id]) : {};
};

var currentUser = getCurrentUser();
var status = !currentUser ? "no_current_user" : "ok";
activeTabMessage("enterFillingMode", currentUser , status ,  function(response){ console.log("Send")});

chrome.commands.onCommand.addListener(function (command) {

  if (command === "filling_mode") {
    var currentUser = getCurrentUser();
    var status = !currentUser ? "no_current_user" : "ok";
    activeTabMessage("enterFillingMode", currentUser , status ,  function(response){});
  }
});



function activeTabMessage(actionName, currentUser, status , responseFunction){
  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id, {action: actionName, user: currentUser, status: status},
        function(response) { responseFunction(response) }
      );
    }
  );
}
