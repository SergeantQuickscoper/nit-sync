import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('events', (table) => {
        table.dateTime("start_time").notNullable();
        table.dateTime("end_time").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('events', (table) => {
        table.dropColumn('start_time')
        table.dropColumn('end_time')
    })
}

