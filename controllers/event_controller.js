//all requirements ß
const express = require('express');
router = express.Router();
const allUserStuff = require('../models/user_model');
const allEventStuff = require('../models/events_model');
const allTransStuff = require('../models/transactions_model');
const calculate = require('../models/calculations');
const emailFunctions = require('../models/email');
const multer = require('multer');



//check if logged in. if not, redirect to home
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
    cb(null, Date.now()+'-'+req.user._json.email);

  }
});
let publicUpload = multer({ storage: publicStorage });

//if sent to active page
router.get('/event/:id/active', loggedIn,function(request, response) {
  let id = request.params.id;
  let transIds = allEventStuff.getTrans(id);
  let accepted = allEventStuff.getAnEvent(id).guests
  let pending = allEventStuff.getAnEvent(id).invited_guests

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("event",  {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email),
    event: allEventStuff.getAnEvent(id),
    trans: allTransStuff.getTransactionsArray(transIds),
    allOtherUsers: allUserStuff.getAllUsernames(allUserStuff.getAUser(request.user._json.email).username),
    nonInvited: allUserStuff.getNonInvited(accepted, pending)
  });
});

//if sent to past page
router.get('/event/:id/past', loggedIn,function(request, response) {
  let id = request.params.id;
  let email = ""
  let user = allUserStuff.getAUser(request.user._json.email)
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("completed",  {
    user: request.user,
    currentUser: user,
    event: allEventStuff.getAnEvent(id),
    dues: calculate.getDues(id),
    email: email

  });
});

//update when email was confrimed
router.get('/event/:id/past/emailConfirmed', loggedIn,function(request, response) {
  let id = request.params.id;
  let email = "Your Reminder Email Was Sent Successfully!"
  let user = allUserStuff.getAUser(request.user._json.email)

  allUserStuff.addNotification((request.user._json.email),
  "You sent a reminder email for " + allEventStuff.getAnEvent(id).name + "!")



  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("completed",  {
    user: request.user,
    currentUser: user,
    event: allEventStuff.getAnEvent(id),
    dues: calculate.getDues(id),
    email: email

  });
});


//calculate debts, save those debts in a json, update if event complete, redirect to completed event
router.get('/eventDues/:id', loggedIn,function(request, response) {
  let id = request.params.id;
  let transIds = allEventStuff.getTrans(id);
  let transArray = allTransStuff.getTransactionsArray(transIds);
  let eventInfo = allEventStuff.getAnEvent(id);
  let eachTotal = calculate.getEachTotal(transArray,id,eventInfo)
  let eachOwes = calculate.eachOwes(eachTotal)
  calculate.setFinalAmounts(eachOwes,id);
  allEventStuff.completeEvent(id);
  response.redirect('/event/'+id+'/past');

});

//update calculations,js when a user paid, redirect back to past event
router.get('/paid/:id', loggedIn,function(request, response) {
  let id = request.params.id;
  let user = allUserStuff.getAUser(request.user._json.email).username
  calculate.userPaid(id,user);
  allUserStuff.addNotification((request.user._json.email),
  "You completed a payment for " + allEventStuff.getAnEvent(id).name + "!")

  response.redirect('/event/'+id+'/past');

});

//send an email reminder when button to do so is clicked, redirect to emailconfrimed
router.post('/email', loggedIn,function(request, response) {
  let username = request.body.who;
  let id = request.body.id;
  let current = request.body.current;
  let amount = request.body.amount
  let name = allEventStuff.getAnEvent(id)["name"];
  let email = allUserStuff.getEmail(username);
  emailFunctions.sendReminder(username,email,id,current,amount,name);
  response.redirect('/event/'+id+'/past/emailConfirmed');
});

//if try to join an event (form on index)
router.post('/join', loggedIn, function(request, response) {
let id = allEventStuff.searchForCode(request.body.eventCode)
let user = allUserStuff.getAUser(request.user._json.email).username;
console.log("adding")
  //add them to the event
  allUserStuff.pendingToActive(request.user._json.email,id)
  allEventStuff.pendingToActive(allUserStuff.getAUser(request.user._json.email).username,id)


  allUserStuff.addNotification((request.user._json.email),
  "You joined an event: " + allEventStuff.getAnEvent(id).name + "!")

//if the id isn't associated with a group
if(id == "0"){
  //send to error page
  response.redirect('/error?code=404');
}
//else, send to the given event
else{
  response.redirect('/event/'+id+'/active');
}
});

//add a friend to an event (using form), redirect back to current page
router.post('/addFriend', loggedIn, function(request, response) {
  let user = request.body.friend_name;
  let id = request.body.id;
  //if this user exists
  if(allUserStuff.verifyUser){
    //add user  to group
    allEventStuff.addPendingUser(id,user)
  }
  //update the users info
  allUserStuff.updateEventArraysForString_pending(user,id)

  allUserStuff.addNotification((request.user._json.email),
  "You invited" + user + "to " + allEventStuff.getAnEvent(id).name + "!")

  response.redirect('/event/'+id+'/active');
});

//when a new transaction is submitted, save data and then redirect back to current page
router.post('/newTransaction', publicUpload.single('picture'), loggedIn, function(request, response) {
  let desc = request.body.purchase_desc;
  let price = request.body.purchase_price;
  let user = request.user._json.email;
  let username = allUserStuff.getAUser(request.user._json.email).username
  let eventId = request.body.id;
  let reciept = "";
  if(request.file){
   reciept = "/images/"+request.file.filename;
 }
  let transId = allTransStuff.createNewTransaction(eventId, user, username, desc, price, reciept)
  allEventStuff.addTransaction(transId,eventId)
  allEventStuff.addTransTotal(price,eventId)
  response.redirect('/event/'+eventId+'/active');
});

router.get('/transaction/:id', loggedIn, function(request, response) {
  let id = request.params.id;

  response.render("transaction",  {
    currentUser: allUserStuff.getAUser(request.user._json.email),
    transaction: allTransStuff.getTransaction(id) ,
    event:allTransStuff.getEventIdFromTrans(id)

  });

  });


  router.get('/disputeChat/:id', loggedIn, function(request, response) {
    let id = request.params.id;
    let transDesc = allTransStuff.getDesc(id)
    let transUser = allUserStuff.getUsername(allTransStuff.getUser(id))
    let transPrice = allTransStuff.getPrice(id)
    let transEvent = allTransStuff.getEvent(id)
    let disputer = allUserStuff.getUsername(allTransStuff.getDisputer(id))
    let reason = allTransStuff.getReason(id)

    console.log(transDesc, transUser, transPrice, transEvent, disputer, reason)

    response.render("disputeChat",  {
      currentUser: allUserStuff.getAUser(request.user._json.email),
      transDesc: transDesc,
      transUser: transUser,
      transPrice: transPrice,
      transEvent: transEvent,
      disputer: disputer,
      reason: reason,
      transId: id
    });

    });



  router.post('/dispute', loggedIn, function(request, response) {
    let id = request.body.id;
    let trans = request.body.dispute_trans;

    let email = allTransStuff.getUser(trans)
    let name = allUserStuff.getAUser(request.user._json.email).username;
    let desc = allTransStuff.getDesc(trans)
    let price = allTransStuff.getPrice(trans)
    let reason = request.body.dispute_reason;
    let event_name = allEventStuff.getName(id)

    console.log(email,name, desc, price, reason,event_name)

    let obj = {
      "reason": reason,
      "disputer": request.user._json.email
    }

    allUserStuff.addNotification((request.user._json.email),
    "You disputed a purchase in " + allEventStuff.getAnEvent(id).name + "!")

    emailFunctions.sendDispute(email,name, desc, price, reason,event_name);
    allTransStuff.addDispute(trans, obj)
    response.redirect('/event/'+id+'/active');


    });


    router.post('/resolve', loggedIn, function(request, response) {
      let trans_id = request.body.trans_id
      let event_id = request.body.event_id

      allTransStuff.removeDispute(trans_id)

      allUserStuff.addNotification((request.user._json.email),
      "You resolved a purchase in " + allEventStuff.getAnEvent(event_id).name + "!")

      response.redirect('/event/'+event_id+'/active');


      });




module.exports = router;
