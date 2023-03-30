import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

import { hash } from 'bcrypt';

faker.locale = 'en_US';

/**
 * Populate user
 * @returns Promise<string[]>
 */
export async function populateUsers(): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from user table
        await client.query('DELETE FROM "user"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "user_id_seq" RESTART WITH 1');

        // Insert 100 fake users
        const owner = ['lionel.bouzonville@forestadmin.com', 'louis@forestadmin.com', 'erlich.bachman@forestadmin.com', undefined];
        for (let i = 0; i < 100; i++) {
            const user = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
                photo : faker.image.people(undefined, undefined, true),
                password_hash: await hash(faker.internet.password(), 10),
                owner: faker.helpers.arrayElement(owner),
                created_at: faker.date.past(1),
                updated_at: faker.date.recent(),
            };

            const insertQuery = {
                text: 'INSERT INTO "user" (first_name, last_name, email, photo, password_hash, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
                values: Object.values(user),
            };

            const result: QueryResult<any> = await client.query(insertQuery);
            ids.push(result.rows[0].id.toString());
        }

        return ids;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}
