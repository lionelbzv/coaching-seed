import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

faker.locale = 'en_US';

/**
 * Populate comment
 * @returns Promise<string[]>
 */
export async function populateComments(userIds, sessionIds): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from comment table
        await client.query('DELETE FROM "comment"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "comment_id_seq" RESTART WITH 1');

        // Insert 5000 fake comment
        for (let i = 0; i < 5000; i++) {
            const comment = {
                user_id: faker.helpers.arrayElement(userIds),
                session_id: faker.helpers.arrayElement(sessionIds),
                comment: faker.lorem.paragraph(),
            };

            const insertQuery = {
                text: 'INSERT INTO "comment" (user_id, session_id, comment) VALUES ($1, $2, $3) RETURNING id',
                values: Object.values(comment),
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
