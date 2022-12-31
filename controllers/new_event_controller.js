//..............Include Express..................................//
const express = require('express');
router = express.Router();
const allUserStuff = require('../models/user_model');
const allEventStuff = require('../models/events_model');
const multer = require('multer');


//checks if logged in
function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/');
  }
}

let publicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, Date.now()+'-'+req.user._json.email);

  }
});
let publicUpload = multer({ storage: publicStorage });

//get for create new event. renders new event page
router.get('/newEvent', loggedIn, function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("newEvent",  {
    user: request.user,
    currentUser:allUserStuff.getAUser(request.user._json.email),
    allOtherUsers: allUserStuff.getAllUsernames(allUserStuff.getAUser(request.user._json.email).username)

  });
});

//post for create new event
router.post('/newEvent',publicUpload.single('picture'),loggedIn, function(request, response) {
  let name = request.body.eventName;
  //create array of friends (people in group)
  let friends = [];
  //if there are any friends added to event
  if (request.body.eventFriends){
    //if there is >1 friend added
    if(Array.isArray(request.body.eventFriends)){
      for(let i of request.body.eventFriends ){
        //add all those friends to friends array
        friends.push(i)}
      }
        //if there is 1 friend being added
    else{
    friends.push(request.body.eventFriends)
  }
} //if (request.body.eventFriends)
  let me = []
  me.push(allUserStuff.getAUser(request.user._json.email).username)
  console.log("ME", me)
  let id;
  //create new event and save id
  if(request.file){
   id = allEventStuff.createNewEvent(name, friends,"/images/"+request.file.filename, me);
 }else{
   id = allEventStuff.createNewEvent(name, friends," ", me);

}
  //update user data
  allUserStuff.updatePendingEventArrays(friends,id)


  allUserStuff.updateEventArraysForString((allUserStuff.getAUser(request.user._json.email).username),id)
  allUserStuff.addNotification((request.user._json.email), 
  "You created an event named: " + name + "!")

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  //redirect to event page
  response.redirect('/event/'+id.toString()+'/active');

});


module.exports = router;
