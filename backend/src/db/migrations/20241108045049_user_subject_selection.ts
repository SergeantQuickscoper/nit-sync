import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_subject_selection", (table) => {
        table.increments("id").primary().notNullable();
        table.integer("uid").references("uid").inTable("user_auth")
        table.integer("subject_id").references("subject_id").inTable("subjects")
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
    
}

