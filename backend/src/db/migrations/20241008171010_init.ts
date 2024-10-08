import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("userAuth", (table) =>{
        table.increments('uid').primary;
        table.string("email").unique;
        table.string("password");
        table.string("role");
        table.integer("verificationToken");
        table.dateTime("verificationExpiry");
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("userAuth")
}


