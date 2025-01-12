import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_auth", (table) => {
        table.specificType('notification_device_token', 'text ARRAY');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_auth", (table) => {
        table.dropColumn("notification_device_token");
    })
}

