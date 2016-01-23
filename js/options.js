var INPUT_LABELS = ['name', 'surname', 'password', 'email', 'address'];


$(document).ready(function(){

  var currentUser = getCurrentUser();

  currentUser = currentUser.id ? currentUser : getFirstUser();

  if (!currentUser.id) {
    changeLabelToAddNew();
  } else {
    writeCurrentUser(currentUser.id);
    changeLabelToUpdateInfo(currentUser);
    switchUserForEdit(currentUser);
  }
  updateUsersToSwitch();

  $('#addNewUser').click(function(){
    switchUserForEdit({});
    delete localStorage["currentUserId"];
    changeLabelToAddNew();
  });

  $('#updateUserInfo').click(function() {
    var currentUser = getCurrentUser();
    var id = !currentUser.id ? +new Date : currentUser.id;
    currentUser =  updateCurrentUser(id);
    changeLabelToUpdateInfo(currentUser);
    updateUsersToSwitch();
  });

});


var updateUsersToSwitch = function(){
  users = getUsers();
  $('#switchUsers').html("").append((function() {
      var _results = [];
      for (var _i = 0;_i < users.length; _i++) {
        user = users[_i];
        _results.push(userSwitchElement(user));
      }
      return _results;
  })());
};

var getUsers = function(){
  var users = findLocalItems("user\d*");
  return users === undefined ? [] : users ;  
};

var writeCurrentUser = function(id){
  if (id){
    localStorage["currentUserId"] = id;
  }else{
    delete localStorage["currentUserId"]
  }
};

var getCurrentUser = function(){
  var id = localStorage["currentUserId"];
  return id ? JSON.parse(localStorage["user"+id]) : {};
};


var updateCurrentUser = function(currentUserId){
  var user = createOptionsFromInputs();
  user.id = currentUserId;
  writeCurrentUser(user.id);
  localStorage["user"+user.id] = JSON.stringify(user);
  return user;
};

function findLocalItems(query) {
  var results = [];
  for (var i in localStorage) {
    if (localStorage.hasOwnProperty(i)) {
      if (i.match(query) || (!query && typeof i === 'string')) {
        var value = JSON.parse(localStorage.getItem(i));
        results.push(value);
      }
    }
  }
  return results;
}


var changeLabelToUpdateInfo = function(user) {
  $('#updateUserInfo').text('Update user: ' + user.name + ' '+ user.surname).data('state', 'update')
};

var changeLabelToAddNew = function() {
  $('#updateUserInfo').text('Create new user').data('state', 'create');
};

var userSwitchElement = function(user) {
  var mainDiv = $('<div>');

  $('<button>').text(
    user.name + " " +user.surname
  ).bind("click", function(e) {
    switchUserForEdit(JSON.parse(localStorage["user"+user.id]));
  }).appendTo(mainDiv);

  $('<button>').text(
    "delete it"
  ).bind("click", function(e) {
    delete localStorage['user'+user.id];
    if (localStorage['currentUserId'] == user.id){
      var userToSwitch = getFirstUser();
      localStorage['currentUserId'] =  userToSwitch.id;
      switchUserForEdit(userToSwitch);
      if(!userToSwitch.id){
        changeLabelToAddNew();
        delete localStorage['currentUserId'];
      }else{
        changeLabelToUpdateInfo(userToSwitch);
      }
    }
    updateUsersToSwitch();
  }).appendTo(mainDiv);

  return mainDiv;
};


var getFirstUser = function(){
  var users = getUsers();
  return users.length > 0 ? users[0] : {};
};

var switchUserForEdit = function(user) {
  for (var _i = 0;_i < INPUT_LABELS.length; _i++) {
    var input = INPUT_LABELS[_i];
    fillInput(input, user[input]);
  }
  $('#currentUserLabel').text(user.name + " " + user.surname);
};

var fillInput = function(input, value) {
  return $("#" + input).val(value);
};

var createOptionsFromInputs = function() {
  var options = {};
  for (var _i = 0; _i < INPUT_LABELS.length; _i++) {
    var input = INPUT_LABELS[_i];
    options[input] = getInputValue(input);
  }
  return options;
};

var getInputValue = function(input) {
  return $("#" + input).val();
};