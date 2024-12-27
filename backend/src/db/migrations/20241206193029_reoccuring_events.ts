import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("reoccuring_events", (table) => {
        table.increments("reoccuring_event_id").notNullable().primary();
        table.string("reoccuring_event_name").notNullable();
        table.integer("subject_id").notNullable().references("subject_id").inTable("subjects").onDelete("CASCADE");
        table.string("reoccuring_event_desc");
        table.integer("created_by").notNullable().references("uid").inTable("user_auth").onDelete("CASCADE");
        table.string("reoccuring_event_type");
        table.string("reoccuring_day").notNullable();
        table.dateTime("start_time").notNullable();
        table.dateTime("end_time").notNullable();
        table.timestamps(true, true, false);  
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("reoccuring_events")
}

