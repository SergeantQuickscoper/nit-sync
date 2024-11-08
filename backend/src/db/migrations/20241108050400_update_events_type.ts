import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("events", (table) => {
        table.string("event_type").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("events", (table) => {
        table.dropColumn("event_type")
    })
}

