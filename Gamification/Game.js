const ranks = require('./Game_ranks');
const achievements = require('./Game_achievements');

function main(){
    // console.log(ranks.didRankChanged('0123', '1700:22:11'));
    // console.log(ranks.getCurrentRank('0123'));

    console.log(new Date().getDay() == 5);
}

function getRank(workedHours){
    return ranks.getCurrentRank(workedHours);
}

function detectRankChange(workedTime, newWorkedTime){
    return ranks.didRankChanged(workedTime, newWorkedTime);
}

function doAntiWorktime(antiWorkedTime){
   // SUMARESTA y actualiza
}

function getAntiWorkedTime(antiWorkedTime){
    return 40 - antiWorkedTime;
}

// main();

module.exports = {
    getRank,
    detectRankChange
}