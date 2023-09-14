const sqlite = require('better-sqlite3');
const config = require('../Config/config.json');
const path = require('path');
const db = new sqlite(path.resolve(config.BD), {fileMustExist: true});

function query(sql, params) {
  return db.prepare(sql).all(params);
}

function query_noParams(sql) {
  return db.prepare(sql).all();
}

function run(sql, params) {
  return db.prepare(sql).run(params);
}

function run_noParams(sql) {
  return db.prepare(sql).run();
}

function transaction(funcion){
  return db.transaction(funcion);
};



module.exports = {
  query,
  query_noParams,
  run,
  run_noParams,
  transaction
}