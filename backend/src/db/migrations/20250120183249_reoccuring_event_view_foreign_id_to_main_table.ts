import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("reoccuring_event_view", (table) => {
        table.integer("reoccuring_event_id").notNullable().references("reoccuring_event_id").inTable("reoccuring_events").onDelete("CASCADE");
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("reoccuring_event_view", (table) => {
        table.dropColumn("reoccuring_event_view")
    })
}

