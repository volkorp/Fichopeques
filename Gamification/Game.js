const ranks = require('./Game_ranks');
const achievements = require('./Game_achievements');
const calculations = require('../Services/Calculations');


function main(){
    // console.log(ranks.didRankChanged('0123', '1700:22:11'));
    // console.log(ranks.getCurrentRank('0123'));

    console.log(new Date().getDay() == 5);
}

function getRank(employee){
    return ranks.getCurrentRank(employee);
}

function doAntiWorktime(antiWorkedTime){
   // SUMARESTA y actualiza
}

function getAntiWorkedTime(antiWorkedTime){
    return 40 - parseInt(calculations.getHoursFromWorkedTime(antiWorkedTime));
}

main();

module.exports = {
    getRank
}