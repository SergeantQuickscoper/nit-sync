import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("subjects", (table) => {
        table.increments("subject_id").primary();
        table.string("subject_name").notNullable();
        table.string("description");
        table.integer("created_by").notNullable().references("uid").inTable("user_auth")
    })
}


export async function down(knex: Knex): Promise<void> { 
    return knex.schema.dropTableIfExists("subjects")
}

