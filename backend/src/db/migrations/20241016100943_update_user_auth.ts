import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_auth", (table) => {
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("roll_no").notNullable();
        table.string("branch").notNullable();
        table.string("section");
        table.string("first_year").notNullable();
        table.string("education_level").notNullable();
        table.string("class_roll_no").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_auth", (table) => {
        table.dropColumns("first_name", "last_name", "roll_no", "branch", "first_year", "education_level", "class_roll_no", "section");
    })
}

