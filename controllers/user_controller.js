//..............Include Express..................................//
const express = require('express');
router = express.Router();
const allUserStuff = require('../models/user_model');
const multer = require('multer');


//check if logged in
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

// get for /wallet renders wallet page
router.get('/wallet', loggedIn, function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("wallet",  {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email)

  });
});

// get for /account renders account info page form

router.get('/account', loggedIn, function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("accountSettings" ,{
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email)

  });
});



//post for /acount
router.post('/account', publicUpload.single('picture'), loggedIn, function(request, response, next ) {
//gets all form data
let name = request.body.acct_name;
let username = request.body.acct_user;
//update user info
allUserStuff.updateUser(request.user._json.email, name, username);
console.log("FILE", request.file)
  const file = request.file;
  if(file){
  allUserStuff.setPic(request.user._json.email,"/images/"+file.filename)
}

//refresh page
response.redirect('/account');
});





module.exports = router;
