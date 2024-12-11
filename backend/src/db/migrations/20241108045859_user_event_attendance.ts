import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_event_attendance", (table) => {
        table.increments("id").primary().notNullable();
        table.integer("uid").references("uid").inTable("user_auth").onDelete("CASCADE")
        table.integer("event_id").references("event_id").inTable("events").onDelete("CASCADE")
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_event_attendance")
}

