import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("events", (table) => {
        table.integer("reoccuring_event_id").defaultTo(null).references("reoccuring_event_id").inTable("reoccuring_events").onDelete("CASCADE");
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("events", (table) => {
        table.dropColumn("reoccuring_event_id");
    })
}

