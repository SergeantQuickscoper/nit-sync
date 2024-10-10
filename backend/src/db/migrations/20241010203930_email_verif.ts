import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("email_verification", (table) => {
        table.increments("id").primary().notNullable();
        table.string("new_email").notNullable();
        table.integer("verification_token").notNullable();
        table.dateTime("verification_token_expires_at").notNullable();
        table.boolean("is_verified").defaultTo(false).notNullable();
        table.timestamps(true, true, false);
    })
}


export async function down(knex: Knex): Promise<void> {
}

