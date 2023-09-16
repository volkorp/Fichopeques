const ranks = require('./Config/Ranks.json');
const ranks_admin = require('./Config/Ranks_admin.json');

const isAdmin = true; //TODO: llevar a función y a fichero a parte.

function getCurrentRank(workedTime){
    return isAdmin ? getAdminRank(workedTime) : getRank(workedTime);
}

function didRankChanged(workedTime, newWorkedTime) {
    return getRank(workedTime) != getRank(newWorkedTime);
}

function getRank(workedHours){
    var rankName = "";

    for(element in ranks){        
        if (workedHours > ranks[element].minVal && workedHours <= ranks[element].maxVal){
            rankName = element;
        }
    }

    return rankName;
}

// ============ADMIN==============
function getAdminRank(workedHours){ 
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