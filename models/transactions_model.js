const fs = require('fs');


exports.createNewTransaction =  function (eventId, user, username, desc, price, reciept){
let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
let myID = Math.floor(Math.random() * 1000000000000)

let newTrans = {
  "id": myID,
  "event_id": eventId,
  "user": user,
  "username": username,
  "desc": desc,
  "price": price,
  "receipt": reciept,
  "dispute" : ""
}
  trans[myID] = newTrans;
  fs.writeFileSync(__dirname+'/../data/transactions.json', JSON.stringify(trans));
  return myID
}


exports.addDispute =  function (id,obj){
let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
trans[id].dispute.push(obj)
  fs.writeFileSync(__dirname+'/../data/transactions.json', JSON.stringify(trans));
}


exports.getTransaction = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id];
}
exports.getUser = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id].user;
}

exports.getDesc = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id].desc;
}

exports.getEvent = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id].event_id;
}

exports.getDisputer = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id].dispute[0].disputer;
}

exports.getReason = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id].dispute[0].reason;
}

exports.getPrice = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id].price;
}

exports.getEventIdFromTrans = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id]["event_id"]

}

exports.getTransactionsArray = function(idArray){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  let transArray = []
  for(let i of idArray){
    transArray.push(trans[i])
  }
  return(transArray)


}

exports.removeDispute = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  trans[id]["dispute"]=[]
  fs.writeFileSync(__dirname+'/../data/transactions.json', JSON.stringify(trans));


}
