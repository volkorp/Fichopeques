const dbFunctions = require('../Services/DB_functions');
const { detectRankChange, getRank } = require('../Gamification/Game')

function calculateWorkedTime(resultset){
    // if(hasIncidence(resultset)){
    //     console.log("Se deben corregir las incidencias antes de hacer el cálculo.");
    //     return null;
    // }

    var tiempoTrabajado = 0;
    var entrada;
    var salida;
    
    for(entry of resultset){
        if(entry.Type == "Entrada"){            
            entrada = formatDate(entry.Time_mark);
        } else if (entry.Type == "Salida" && entrada != null) {
            salida = formatDate(entry.Time_mark);
            tiempoTrabajado += salida - entrada;            
            entrada = null;
        }        
    }
    
    return parseMSToWorkedTime(tiempoTrabajado);
}

function formatDate(date){    
    return Date.parse(date.replace(" ","T"));
}

// function parseDateToMS(date){
//     const [datePart, timePart] = date.split(" ");
//     const [day,month,year] = datePart.split("\/");
//     // console.log(date.replace("/\//g", "-").replace(" ","T"));
//     return Date.parse(`${year}-${month}-${day}T${timePart}`);
// }

function parseMSToWorkedTime(timeInMilliseconds){
    let seconds = Math.floor(timeInMilliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    if (seconds < 10) seconds = `0${seconds}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    return `${hours}:${minutes}:${seconds}`;
}

function getDate(date){
    return date.split(" ")[0];
}

function hasIncidence(dayCalculated){
    var entrada = 0;
    var salida = 0;

    for(entry of dayCalculated){
        if(entry.Type == "Entrada") entrada += 1;
        if(entry.Type == "Salida") salida += 1;
    }

    return (!(dayCalculated.length % 2 == 0 && entrada == salida));
}

function huntIncidences(resultset){
    var entrada = 0;
    var salida = 0;
    var lastDay = "";
    var currentDay = "";
    var incidences = [];
    var idx = 0;

    for(entry of resultset){
        currentDay = getDate(entry.Mark_time);

        console.log(`Index: ${idx} | Entrada: ${entrada} | Salida: ${salida}`);

        if ((lastDay != currentDay) && entrada != salida){            
            incidences.push(entry);       
        } else if ((lastDay != currentDay)){
            entrada = 0;
            salida = 0;        
        } 

        if(entry.Type == "Entrada") entrada += 1;
        if(entry.Type == "Salida") salida += 1;
        
        console.log(`Last: ${lastDay} | Current: ${currentDay} | Index: ${idx}`);

        lastDay = currentDay;
  
        
        idx += 1;
        
    }

    return incidences;
}

function getNewAllTimeWorkedTime(currentWorkedTime, timeAdding){
    console.log("Holi");
    var [currentHours, currentMins, currentSecs] = currentWorkedTime.split(":");
    var [addingHours, addingMins, addingSecs] = timeAdding.split(":");

    var hours = parseInt(currentHours) + parseInt(addingHours);
    var minutes = parseInt(currentMins) + parseInt(addingMins);
    var seconds = parseInt(currentSecs) + parseInt(addingSecs);

    return `${hours}:${minutes}:${seconds}`;
}

function addDayTimeToTotal(employee, timeWorkedToday){
    dbFunctions.getAllTimeWorkedTime(employee).then(response => {
        var respuesta = `Hoy has trabajado ${timeWorkedToday}.`;
        console.log(response[0]);
        if(response[0] && response.statusCode){
            var workedTime = getHoursFromWorkedTime(response[0].time_worked);
            var newWorkedTime = getHoursFromWorkedTime(timeWorkedToday);

            if (detectRankChange(workedTime, newWorkedTime)){
                respuesta += `\\n\\n¡Enhorabuena! Por tu dedicación, has subido tu peque-rango a: ${getRank()}`;
            };

            updateWorkedTime();

            return respuesta;
        } else { 
            //TO-DO: handle
        }
        
    }, err =>{
        console.error(`[Error] `, err.message);
    });
}

function updateWorkedTime(){
    // var newWorkedTime = getNewAllTimeWorkedTime(workedTime, timeWorkedToday);
    //TODO: Update el tiempo trabajado total.
}

function getHoursFromWorkedTime(workedTime){
    return parseInt(workedTime.split(":")[0]);
}

function isFriday() {
    return new Date().getDay() == 5
}


module.exports = {
    calculateWorkedTime,        
    addDayTimeToTotal,    
    getHoursFromWorkedTime,
    isFriday,
    getNewAllTimeWorkedTime
}