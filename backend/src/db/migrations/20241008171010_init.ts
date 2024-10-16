import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_auth", (table) => {
        table.increments('uid').primary();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.string("role").defaultTo("student").notNullable();
        table.integer("pass_reset_token");
        table.dateTime("pass_reset_expiry");
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_auth")
}


