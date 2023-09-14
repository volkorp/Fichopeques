const ranks = require('./Config/Ranks.json');
const ranks_admin = require('./Config/Ranks_admin.json');
const calculations = require('../Services/Calculations')

const isAdmin = true; //TODO: llevar a función y a fichero a parte.

function getCurrentRank(employee){
    var workedTime = getAllTimeWorkedTime(employee);
    return isAdmin ? getAdminRank(workedTime) : getRank(workedTime);
}

function didRankChanged(employee, timeAdding) {
    var currentWorkedTime = calculations.getAllTimeWorkedTime(employee);
    var newWorkedTime = calculations.getNewAllTimeWorkedTime(currentWorkedTime, timeAdding);
    return getRank(currentWorkedTime) != getRank(newWorkedTime);
}

function getRank(workedTime){    
    var workedHours = calculations.getHoursFromWorkedTime(workedTime);
    var rankName = "";

    for(element in ranks){        
        if (workedHours > ranks[element].minVal && workedHours <= ranks[element].maxVal){
            rankName = element;
        }
    }

    return rankName;
}

// ============ADMIN==============
function getAdminRank(workedTime){    
    var workedHours = calculations.getHoursFromWorkedTime(workedTime);
    var rankName = "";

    for(element in ranks_admin){        
        if (workedHours > ranks_admin[element].minVal && workedHours <= ranks_admin[element].maxVal){
            rankName = element;
        }
    }

    return rankName;
}
// ==========================

module.exports = { 
    didRankChanged,
    getCurrentRank
}