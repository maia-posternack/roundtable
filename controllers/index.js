//..............Include Express..................................//
const express = require('express');
router = express.Router();
const allUserStuff = require('../models/user_model');
const allEventStuff = require('../models/events_model');

//check if logged in
function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/');
    }
}
//if at homepage
router.get('/', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  //check if signed in with google
  if(request.user){
    //if this user has never signed in before
    if (allUserStuff.userExists(request.user._json.email) == false){
      //create a new user.json with their info
      allUserStuff.createNewUser(
        request.user._json.email,
        request.user._json.name,
        request.user._json.given_name,
        request.user._json.family_name,
        request.user._json.picture
      );
      //set current user as the user with that email
      allUserStuff.setCurrentUser =  allUserStuff.getAUser(request.user._json.email)
    }
    let eventArray = allUserStuff.getEvents(request.user._json.email)
    let currentE = allEventStuff.currentEvents(eventArray)
    let pastE = allEventStuff.pastEvents(eventArray)

    let pendingArray = allUserStuff.getPending(request.user._json.email)
    let pendingE = allEventStuff.pendingEvents(pendingArray)
    console.log("current", currentE, "past", pastE)
    //render index.html
    response.render("index", {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email),
    currentEvents: currentE,
    pastEvents: pastE,
    pendingEvents: pendingE

  });
} //if request.user
//if not logged in with google
  else{
    //send to not_loggefd page
    response.render("not_logged", {
    user: request.user
    }); }

});


router.get('/accept/:id', loggedIn,function(request, response) {
  let id = request.params.id;
  allUserStuff.pendingToActive(request.user._json.email,id)
  allEventStuff.pendingToActive(allUserStuff.getAUser(request.user._json.email).username,id)
  allUserStuff.addNotification((request.user._json.email),
  "You joined an event named: " + allEventStuff.getAnEvent(id).name + "!")

  response.redirect('/');

});

router.get('/decline/:id', loggedIn,function(request, response) {
  let id = request.params.id;
  allUserStuff.pendingToDelete(request.user._json.email,id)
  allEventStuff.pendingToDelete(allUserStuff.getAUser(request.user._json.email).username,id)

  allUserStuff.addNotification((request.user._json.email),
  "You declined an event named: " + allEventStuff.getAnEvent(id).name + "!")

  response.redirect('/');

});



//sent to error page
router.get('/error', function(request, response) {
  const errorCode = request.query.code;
  //if no errorCode sent, then errorCode is 400
  if (!errorCode) errorCode = 400;
  const errors = {
    '400': "Unknown Client Error",
    '401': "Invlaid Login",
    '404': "Resource Not Found",
    '500': "Server problem"
  }
  response.status(errorCode);
  response.setHeader('Content-Type', 'text/html')
  if(request.user){
    //if there is a user, render errorpage with currentUser
  response.render("error", {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email),
    "errorCode": errorCode,
    "details": errors[errorCode]
  });
}else{
  //if there isn't a user, render error page without currentUser
  response.render("error", {
    user: request.user,
    "errorCode": errorCode,
    "details": errors[errorCode]
  });

  }
});

module.exports = router
