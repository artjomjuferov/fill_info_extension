var INPUT_LABELS = ['name', 'surname', 'password', 'email', 'address'];

chrome.extension.onMessage.addListener(function(message, sender, _sendResponse){
  console.log(message.user);
  console.log("here");
  if(message.action == "enterFillingMode")
  {
    console.log("Here");
    if (message.status === "ok"){

    }else{
      alert("Go to options and choose user");
    }
  }
  return true;
});


var findNameInput = function() {
  var queries = [
    "name='name'",
    "name='Name'",
    "name='firstname'",
    "name='first name'",
    "name='Firstname'",
    "name='First name'",
    "name='имя'"
  ];
  return tryFindElement(queries);
};

var tryFindElement = function(queries) {
  for (var i = 0; i < queries.length; i++) {
    query = queries[i];
    var el = $("input[" + query + "]");
    if (el.length !== 0){
      return el;
    }
  }
};


var findSurnameInput = function() {
  var queries = [
    "name='Фамилия'",
    "name='second name'",
    "name='Second name'",
    "name='secondname'",
    "name='Secondname'",
    "name='Surname'",
    "name='surname'"
  ];
  return tryFindElement(queries);
};

findAddressInput = function() {
  var queries = [
    "name='address'"
  ];
  return tryFindElement(queries);
};
findPasswordInput = function() {
  var queries = [
    "name='password'",
    "name='Password'",
    "name='pass'",
    "name='Pass'"
  ];
  return tryFindElement(queries);
};
findConfirmPasswordInput = function() {
  var queries = [
    "name='confirmpassword'",
    "name='confirm_password'",
    "name='Confirm password'",
    "name='Confirm_password'",
    "name='Confirm Password'"
  ];
  return tryFindElement(queries);
};
findEmailInput = function() {
  var queries = [
    "name='email'",
    "name='mail'"
  ];
  return tryFindElement(queries);
};

setValue = function(el, value) {
  if (el)
    el.val(value);
};

var makePrediction = function(user) {
  setValue(findNameInput(), user.name);
  setValue(findSurnameInput(), user.surname);
  setValue(findAddressInput(), user.address);
  setValue(findPasswordInput(), user.password);
  setValue(findConfirmPasswordInput(), user.password);
  setValue(findEmailInput(), user.email);
};



var init = function(user) {
  makePrediction(user);

  self = this;


  $('input').click(function(e) {
    if (!e.ctrlKey)
      return;
    if (self.currentSelectedInput == null) {
      showSelection(user, this);
      self.currentSelectedInput = $(this);
    } else if (self.currentSelectedInput === this) {
      hideSelection();
      delete self.currentSelectedInput;
    } else {
      hideSelection();
      self.currentSelectedInput = $(this);
      showSelection(user, this);
    }
  });
};
init({name:"artjom", surname:"juferov"});


showSelection = function(user, inputEl) {
  $('<div/>', {
    id: 'fill_user_info_shadow'
  }).css({
    left: "0",
    top: "0",
    position: 'fixed',
    width: "100%",
    height: "100%",
    backgroundColor: 'black',
    opacity: 0.7,
    zIndex: 1023
  }).click(function(){
    hideSelection();
  }).appendTo('body');

  var divWithOptions = $('<div/>', {
    id: 'fill_user_info_options'
  }).css({
    left: "30%",
    top: "30%",
    position: 'fixed',
    fontSize: 24,
    zIndex: 1024
  }).appendTo('body');

  for (var i = 0; i < INPUT_LABELS.length; i++) {
    if (user[INPUT_LABELS[i]])
      selectOptionElement(user, INPUT_LABELS[i], inputEl).appendTo(divWithOptions);
  }
};

hideSelection = function() {
  $('#fill_user_info_shadow').remove();
  return $('#fill_user_info_options').remove();
};

selectOptionElement = function(user, attr, inputEl) {
  return $('<button/>').text(
    attr + ": " + user[attr]
  ).css({
    width: "500px",
    height: "60px"
  }).click(function() {
    $(inputEl).val(user[attr]);
    hideSelection();
  });
};


