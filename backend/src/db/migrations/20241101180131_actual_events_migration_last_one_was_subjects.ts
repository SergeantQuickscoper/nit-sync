import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("events", (table) => {
        table.bigIncrements("event_id").primary().notNullable();
        table.string("event_name").notNullable();
        table.integer("subject_id").notNullable().references("subject_id").inTable("subjects");
        table.string("event_desc");
        table.integer("created_by").notNullable().references("uid").inTable("user_auth");
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("events")
}

