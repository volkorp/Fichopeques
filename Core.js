
const { Telegraf } = require('telegraf');
const { TOKEN, OWNER_ID, ADMIN_ID } = require('./Config/config.json');
const { C_ID, A_ID, C_NAME, A_NAME } = require('./Config/Whitelist.json')
const bot = new Telegraf(TOKEN);

const dbFunctions = require('./Services/DB_functions');
const calculations = require('./Services/Calculations');

bot.command('start', ctx => {
    log("Start", ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, `¡Hola ${ctx.from.first_name}!`);
});

bot.hears(['holi', 'hola'], (ctx, next) => {
    log("Hears holi", ctx.from);

    bot.telegram.sendMessage(ctx.chat.id, `Hola`);
});

bot.command('fichar', ctx => {
    log("Fichar", ctx.from);
    
    if(isEmployee(ctx.chat.id) || isAdmin(ctx.chat.id)){   
        ctx.reply("¿Qué quieres fichar? 👀", {     
            reply_markup: {
                inline_keyboard: [                    
                    [ { text: "💪 Entrada", callback_data: "Entrada" }, { text: "🥳 Salida", callback_data: "Salida" } ],
                ]
            }
        });
    }
});

bot.action('Entrada', async (ctx) => {
    if(isEmployee(ctx.chat.id)){   
        dbFunctions.insertNewTime(ctx.chat.id, now(), 'Entrada').then(resultado => {
            if(resultado && resultado.statusCode){
                log("Entrada", resultado);
                ctx.reply("Fichaje enviado!");
            }
        }, err =>{
            console.error(`[Error] `, err.message);
        });
    }
});
  
bot.action('Salida', async (ctx) => {
    if(isEmployee(ctx.chat.id)){   
        dbFunctions.insertNewTime(ctx.chat.id, now(), 'Salida').then(resultado => {
            if(resultado && resultado.statusCode){
                log("Salida", resultado);
                ctx.reply("Fichaje enviado!");
            }
            
            if(isOwner(ctx.chat.id)){
                dbFunctions.getWorkedTimeToday(ctx.chat.id, yearMonthDay()).then(result => {
                    console.log("Terminó");
                    
                    if(result && result.statusCode){
                        var response = calculations.calculateWorkedTime(result);                        
                        log("Salida", response);
                        if (response != null ){
                            ctx.reply(calculations.addDayTimeToTotal(ctx.chat.id, response));
                        }
                    }
                }, err => {
                    console.error(`[Error] `, err.message);
                });
            }
        }, err =>{
            console.error(`[Error] `, err.message);
        });
    }
});

bot.command('consultar', ctx => {
    log("Consultar", ctx.from);
    
    if(isEmployee(ctx.chat.id)){
        dbFunctions.getLastTenMarksEmployee(ctx.chat.id).then(resultado => {
            if(resultado && resultado.statusCode){                                
                log("Consultar", resultado);
                var response = parseToMessage(resultado);
                
                if (response == ""){
                    response = "No tienes registros actualmente.";
                }

                try {
                    ctx.reply(response);
                } catch (err) {
                    log("getMarksFromC", err);
                }
            }
        }, err =>{
            console.error(`[Error] `, err.message);
        });
    }
});


bot.command('resumen', ctx => {
    log("Consultar", ctx.from);
    
    if(isEmployee(ctx.chat.id)){
        dbFunctions.getWorkedTime(ctx.chat.id, yearMonth()).then(resultado => {
            if(resultado && resultado.statusCode){                                
                log("Consultar", resultado);

                var response = calculations.calculateWorkedTime(resultado);
                
                if (response == ""){
                    response = "No tienes registros actualmente.";
                }

                try {
                    ctx.reply(`Este mes has trabajado: ${response}.`);
                } catch (err) {
                    log("getMarksFromC", err);
                }
            }
        }, err =>{
            console.error(`[Error] `, err.message);
        });
    }
});

bot.command('admin', ctx => {
    log("Admin", ctx.from);
    
    if(isAdmin(ctx.chat.id)){
        ctx.reply("Consultando los últimos registros de... 👩‍💻", {     
            reply_markup: {
                inline_keyboard: [                    
                    [ { text: `${C_NAME} 👩`, callback_data: "getMarksFromC" }, { text: `${A_NAME} 👧`, callback_data: "getMarksFromA" } ],
                ]
            }
        });
    }
});

bot.action('getMarksFromC', async (ctx) => {
    if(isAdmin(ctx.chat.id)){   
        dbFunctions.getMarksFromEmployee(C_ID).then(resultado => {
            if(resultado && resultado.statusCode){                                
                log("getMarksFromC", resultado);

                var response = parseToMessage(resultado);
                
                if (response == ""){
                    response = "No hay registros actualmente.";
                }

                try {
                    ctx.reply(response);
                } catch (err) {
                    log("getMarksFromC", err);
                }
            }
        }, err =>{
            console.error(`[Error] `, err.message);
        });
    }
});

bot.action('getMarksFromA', async (ctx) => {
    if(isAdmin(ctx.chat.id)){   
        dbFunctions.getMarksFromEmployee(A_ID).then(resultado => {
            if(resultado && resultado.statusCode){                                
                log("getMarksFromA", resultado);
                
                var response = parseToMessage(resultado);
                
                if (response == ""){
                    response = "No hay registros actualmente.";
                }

                try {
                    ctx.reply(response);
                } catch (err) {
                    log("getMarksFromA", err);
                }
            }
        }, err =>{
            console.error(`[Error] `, err.message);
        });
    }
});

// Utils
function now(){
    return new Date().toISOString().replace(",", " -");
}

function yearMonth(){
    var month = new Date().getMonth()+1;

    if(month < 10) month = `0${month}`;

    var year = new Date().getFullYear();
    return `${year}-${month}`;
}

function yearMonthDay(){
    var day = new Date().getDate();
    if(day < 10) day = `0${day}`;

    return `${yearMonth()}-${day}`;
}

function parseToMessage(collection){        
    var response = "";

    for (var i = 0; i < collection.length; i++){      
      var obj = collection[i];

      for (var key in obj){
        var value = obj[key];

        response += key + ": "  + value + " | "
        
        if(key == "Type"){
            response += "\n";
        }
      }
    }

    return response;
}

function isAdmin(id){
    return id == ADMIN_ID || isOwner(id);
}

function isOwner(id){
    return id == OWNER_ID;
}

function isEmployee(id){
    return id == C_ID || id == A_ID || isOwner(id);
}

function log(fromFunction, ctx){
    console.log("-------------------------------------")
    console.log(`[${now()}] - ${fromFunction}`);
    console.log(ctx);
    console.log("-------------------------------------")
}

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))