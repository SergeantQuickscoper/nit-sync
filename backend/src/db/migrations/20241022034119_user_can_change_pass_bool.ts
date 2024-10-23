import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_auth", (table) =>{
        table.boolean("can_change_pass").defaultTo("false")
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_auth", (table) => {
        table.dropColumn("can_change_pass")
    })
}

