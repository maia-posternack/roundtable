//require fs
const fs = require('fs');


exports.getEachTotal =  function (transArray,eventId,eventInfo){
  let allTotals = {}
  for (let guest of eventInfo.guests){
    allTotals[guest]= 0;
  }
  for(let eachTrans of transArray){
    allTotals[eachTrans.username] += parseInt(eachTrans.price)

  }
  console.log(allTotals)
  return(allTotals)
}

exports.eachOwes = function (eachTotal){
  let totalPeople = 0;
  let totalValue = 0
  for (let index in eachTotal){
    totalPeople ++
    totalValue += eachTotal[index]
  }
  let divide = Math.round(100*totalValue/totalPeople)/100
  let difference = []
  for (let index in eachTotal){
    let miniOb = {}
    miniOb["name"] = index
    miniOb["paid"] = eachTotal[index]
    miniOb["owes"] = divide - eachTotal[index]
    difference.push(miniOb)
  }
  difference.sort(function(a, b) {
  return  b.owes - a.owes;
});
  console.log(difference)
  return(difference)

}

exports.setFinalAmounts = function(eachOwes,eventId){

  let allAmounts = JSON.parse(fs.readFileSync(__dirname+'/../data/owe.json'));


  let allDets = {}
  for (let payer in eachOwes){
    allDets[eachOwes[payer].name] = {};
    allDets[eachOwes[payer].name].paid = eachOwes[payer].paid;
    allDets[eachOwes[payer].name].whatToPay = []

      for ( let toBePaid = eachOwes.length-1; toBePaid >=0; toBePaid -- ){
        //check if owes someone money (person1)
        if(eachOwes[payer].owes > 0){
          let paymentDets = {}
        //find the first person that is owed money (person2)
        if (eachOwes[toBePaid].owes < 0){
          if(eachOwes[payer].owes <= -1* eachOwes[toBePaid].owes){
          //if person1 owes less than person2 needs
          paymentDets.whoToPay = eachOwes[toBePaid].name;
          paymentDets.howMuch =  Math.round(100*eachOwes[payer].owes)/100;
          paymentDets.completed = false;

          // set new values
          eachOwes[toBePaid].owes += eachOwes[payer].owes
          eachOwes[payer].owes = 0
        }
        else{
          //if  person1 owes more money than person2 needs
          paymentDets.whoToPay = eachOwes[toBePaid].name;
          paymentDets.howMuch =  Math.round(-100*eachOwes[toBePaid].owes)/100
          paymentDets.completed = false;


          eachOwes[payer].owes += eachOwes[toBePaid].owes
          eachOwes[toBePaid].owes = 0
        }
        console.log(eachOwes[payer].name,eachOwes[payer].owes, eachOwes[toBePaid].name, eachOwes[toBePaid].owes)
        allDets[eachOwes[payer].name].whatToPay.push(paymentDets)
      }

      }
    }
  }
  console.log(allDets)
  allAmounts[eventId] = allDets;
  fs.writeFileSync(__dirname+'/../data/owe.json', JSON.stringify(allAmounts));

  return(allDets)


}

exports.getDues = function (eventId){
  let allAmounts = JSON.parse(fs.readFileSync(__dirname+'/../data/owe.json'));
  return allAmounts[eventId]

}

exports.userPaid = function (eventId,username){
  let allAmounts = JSON.parse(fs.readFileSync(__dirname+'/../data/owe.json'));
  for(let index of allAmounts[eventId][username].whatToPay){
    index.completed = true;
  }
  fs.writeFileSync(__dirname+'/../data/owe.json', JSON.stringify(allAmounts));

}

exports.ifPaid = function (eventId,username){
  let allAmounts = JSON.parse(fs.readFileSync(__dirname+'/../data/owe.json'));
  for(let index of allAmounts[eventId][username].whatToPay){
    return(index.completed)
  }

}
