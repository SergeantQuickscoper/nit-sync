import knex from "knex"
import config from "./knexfile.js"


//WTF is a dependency injection??? 
//Make this an environement variable instead of hardcoding it. 
const db = knex(config.development);

export default db;