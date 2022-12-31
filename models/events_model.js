const fs = require('fs');

exports.getAllEvents = function(){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  return events;
}

exports.getAnEvent = function(eventId){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  return events[eventId];
}

exports.createNewEvent =  function(name, friends, picture, me){
let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
let myID = Math.floor(Math.random() * 1000000000000)
let code = Math.floor(Math.random() * 10000)
let newEvent = {
  "id":myID,
  "invite_code": code,
  "guests": me,
  "name": name,
  "image": picture,
  "completed": false,
  "transactions_ids": [],
  "total_cost": 0,
  "invited_guests":friends

}
  events[myID] = newEvent;
  fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
  return(myID)
}

exports.addUser = function(eventId, newUser){
let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
events[eventId]["guests"].push(newUser)
console.log(events[eventId])
fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
}

exports.addPendingUser = function(eventId, newUser){
let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
events[eventId]["invited_guests"].push(newUser)
console.log(events[eventId])
fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
}

exports.addTransaction = function(transId,eventId){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  events[eventId]["transactions_ids"].push(transId)
  fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
}
exports.addTransTotal = function(transTotal, eventId){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  events[eventId]["total_cost"] = parseInt(  events[eventId]["total_cost"]) +  parseInt(transTotal);
  fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));

}

exports.getTrans = function(id){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  return events[id].transactions_ids
}

exports.getName = function(id){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  return events[id].name
}
exports.completeEvent = function(id){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  events[id].completed = true;
  fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));


}

exports.alreadyThere = function(id,user){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  if(events[id].guests.includes(user)){
    return true
  }
  else{
    return false
  }

}


exports.addJoinedPerson = function(id,user){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  if(events[id].guests.includes(user)){
    fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
  }
  else{
    events[id].guests.push(user)
    fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
  }
}

exports.searchForCode = function (code){
let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
for (let i in events){
if(code == events[i].invite_code){
console.log(code)
return(events[i].id)
}
}
console.log("nope")
return("0")

}

exports.currentEvents = function(eventArray){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  let info = []
  for(let eventId of eventArray){
    if(events[eventId.toString()].completed == false){
    info.push(events[eventId.toString()])
  }
  }
  return(info)
}

exports.pastEvents = function(eventArray){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  let info = []
  for(let eventId of eventArray){
    if(events[eventId.toString()].completed == true){
    info.push(events[eventId.toString()])
  }
  }
  return(info)
}

exports.pendingEvents = function(pendingArray){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  let info = []
  for(let pendingId of pendingArray){
    info.push(events[pendingId.toString()])

  }
  return(info)
}

exports.pendingToActive = function(user, eventId){
  let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
  if(events[eventId].guests.includes(user)==false){
  events[eventId].guests.push(user)
}
  events[eventId].invited_guests = events[eventId].invited_guests.filter(function(item) {
    return item !== user
})
  fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
  }

  exports.pendingToDelete = function(user, eventId){
    let events = JSON.parse(fs.readFileSync(__dirname+'/../data/events.json'));
    events[eventId].invited_guests = events[eventId].invited_guests.filter(function(item) {
      return item !== user
  })
    fs.writeFileSync(__dirname+'/../data/events.json', JSON.stringify(events));
    }
