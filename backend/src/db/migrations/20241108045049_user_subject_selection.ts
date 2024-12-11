import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_subject_selection", (table) => {
        table.increments("id").primary().notNullable();
        table.integer("uid").references("uid").inTable("user_auth").onDelete("CASCADE")
        table.integer("subject_id").references("subject_id").inTable("subjects").onDelete("CASCADE")
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_subject_selection");
}

