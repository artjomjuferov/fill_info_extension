var getCurrentUser = function(){
  var id = localStorage["currentUserId"];
  return id ? JSON.parse(localStorage["user"+id]) : {};
};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getCurrentUser"){
    var currentUser = getCurrentUser();
    var status = !currentUser ? "no_current_user" : "ok";
    sendResponse({user: currentUser, status: status, action: "getCurrentUserResponse"});
  }
  return true;
});