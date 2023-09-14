var mat = [{"ID":"1", "Mark_time":"2023-09-13 16:26:55", "Type": "Entrada"}, 
            {"ID":"3", "Mark_time":"2023-09-13 17:26:55", "Type": "Salida"}, 
            {"ID":"7", "Mark_time":"2023-09-13 19:26:55", "Type": "Entrada"}, 
            {"ID":"9", "Mark_time":"2023-09-13 21:47:57", "Type": "Salida"},
            {"ID":"12", "Mark_time":"2023-09-15 19:26:55", "Type": "Entrada"}, 
            {"ID":"14", "Mark_time":"2023-09-15 21:47:57", "Type": "Salida"}];

function calculateWorkedTime(resultset){
    if(hasIncidence(resultset)){
        return "Se deben corregir las incidencias antes de hacer el cálculo.";
    }

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

function getAllTimeWorkedTime(employee){
    // TODO:
    let query = `SELECT time_worked FROM total_worked WHERE employee = '${employee}'`;
    var resultset = query;
    return '4513:12:11'; //TODO: Query tiempo trabajado total
}

function getNewAllTimeWorkedTime(currentWorkedTime, timeAdding){
    var [currentHours, currentMins, currentSecs] = currentWorkedTime.split(":");
    var [addingHours, addingMins, addingSecs] = timeAdding.split(":");

    var hours = parseInt(currentHours) + parseInt(addingHours);
    var minutes = parseInt(currentMins) + parseInt(addingMins);
    var seconds = parseInt(currentSecs) + parseInt(addingSecs);

    return `${hours}:${minutes}:${seconds}`;
}

function addDayTimeToTotal(employee, timeWorkedToday){
    var respuesta = `Hoy has trabajado ${timeWorkedToday}.`;
    var workedTime = getAllTimeWorkedTime(employee);
    
    if (didRankChanged(employee, workedTime)){
        respuesta += `\\n\\n¡Enhorabuena! Por tu dedicación, has subido tu peque-rango a: ${game.getRank()}`;
    };

    var newWorkedTime = getNewAllTimeWorkedTime(workedTime, timeWorkedToday);
    //TODO: Update el tiempo trabajado total.
    
    return respuesta;
}

function getHoursFromWorkedTime(workedTime){
    return parseInt(workedTime.split(":")[0]);
}

function isFriday() {
    return new Date().getDay() == 5
}


module.exports = {
    calculateWorkedTime,
    getAllTimeWorkedTime,
    getNewAllTimeWorkedTime,
    addDayTimeToTotal,
    getHoursFromWorkedTime,
    isFriday
}