import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("events", (table) => {
        table.integer("notification_count").defaultTo(0);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("events", (table) => {
        table.dropColumn("notification_count");
    })
}

