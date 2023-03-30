import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

faker.locale = 'en_US';

/**
 * Populate session
 * @returns Promise<string[]>
 */
export async function populateSessions(coachIds, sessionTypeIds): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from session table
        await client.query('DELETE FROM "session"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "session_id_seq" RESTART WITH 1');

        // Insert 1000 fake session
        for (let i = 0; i < 1000; i++) {
            const session = {
                coach_id: faker.helpers.arrayElement(coachIds),
                session_type_id: faker.helpers.arrayElement(sessionTypeIds),
                price: faker.commerce.price(),
                nb_courses: faker.random.numeric(),
                start_time: faker.date.soon(60),
                end_time: faker.date.soon(60),
            };

            const insertQuery = {
                text: 'INSERT INTO "session" (coach_id, session_type_id, price, nb_courses, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                values: Object.values(session),
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
