const fs = require('fs');

exports.getAllUsers = function(){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return users;
}

exports.getAllUsernames= function(currentUser){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  let allNames = []
  for (let i in users){
    if(users[i].username.length > 0){
      if(users[i].username !== currentUser){
    allNames.push (users[i].username)
  }
  }}
  return(allNames)
}

exports.getNonInvited= function(accepted_users,pending_users){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  let allNames = []

  for (let i in users){
      if (users[i].username.length > 0){
        if(accepted_users.includes(users[i].username) == false){
          if(pending_users.length == 0){
            allNames.push (users[i].username)
          }
          else{
            if(pending_users.includes(users[i].username) == false){
            allNames.push (users[i].username)


    }
  }//else
}//if not accepted
} //length
}//for
  return(allNames)
}


exports.createNewUser =  function (userEmail, userName, userFirst, userLast, userImage){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  let newUser=
  {
    "email": userEmail,
    "full_name":userName,
    "first_name": userFirst,
    "last_name": userLast,
    "image": userImage,
    "username": userFirst+ Math.floor(Math.random() * 10000),
    "rating_data": [],
    "average_rating": "",
    "event_ids": [],
    "pending_ids": [],
    "notifications": [],
    "unread": 0

  }
  users[userEmail] = newUser;
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));
}

exports.userExists = function(userEmail){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  if(users[userEmail]) return true;
  else return false;
}

exports.getAUser = function(userEmail){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return (users[userEmail])
}

exports.getUsername = function(userEmail){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return (users[userEmail].username)
}

exports.updateUser = function(userEmail,userFullName,userName, userPicture){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  users[userEmail]["full_name"] = userFullName;
  users[userEmail]["username"] = userName;
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.verifyUser = function(username){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for (let i in users){
  if(name == users[i].username){
  return(true)
  }
  }
  return(false)

}

exports.updateEventArrays = function(friends,id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for(let index in users){ //search through all the users
    for(let bff of friends){ //search through all the added friends
    if(users[index].username == bff){
      users[index].event_ids.push(id)
    }
  }
  }
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.updatePendingEventArrays = function(friends,id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for(let index in users){ //search through all the users
    for(let bff of friends){ //search through all the added friends
    if(users[index].username == bff){
      users[index].pending_ids.push(id)
    }
  }
  }
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.updateEventArraysForString = function(friend,id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for(let index in users){
    if(users[index].username == friend){
      users[index].event_ids.push(parseInt(id))
    }
  }
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.updateEventArraysForString_pending = function(friend,id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for(let index in users){
    if(users[index].username == friend){
      users[index].pending_ids.push(parseInt(id))
    }
  }
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.getEvents = function(email){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return (users[email].event_ids)

}

exports.getPending = function(email){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return (users[email].pending_ids)

}

exports.getEmail = function(username){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  for(let i in users){
    if(users[i].username == username){
      return(users[i].email)
    }
  }

}

exports.setPic = function(email,pic){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  users[email].image= pic;
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.addNotification = function(email,notif){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  users[email].notifications.push(notif);
  users[email].unread ++;
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}


exports.pendingToActive = function(email,event_id){
  console.log("ADDING USER INFO")

  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  event_id = parseInt(event_id)
  users[email].pending_ids = users[email].pending_ids.filter(function(item) {
    return item !== event_id
  })
  console.log("USER INFO", users[email].event_ids, event_id)


  if(users[email].event_ids.includes(event_id) == false){
  users[email].event_ids.push(event_id)
  console.log("added")
}
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.pendingToDelete = function(email,event_id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  event_id = parseInt(event_id)
  users[email].pending_ids = users[email].pending_ids.filter(function(item) {
    return item !== event_id
  })
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}
