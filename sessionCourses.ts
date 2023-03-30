import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

faker.locale = 'en_US';

/**
 * Populate session_course
 * @returns Promise<string[]>
 */
export async function populateSessionCourses(sessionIds): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from session_course table
        await client.query('DELETE FROM "session_course"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "session_course_id_seq" RESTART WITH 1');

        // Insert 10000 fake session_course
        for (let i = 0; i < 10000; i++) {
            let start_date = faker.date.soon(60);
            let end_date = new Date(start_date);
            end_date.setHours(start_date.getHours() + 2);
            const session_course = {
                session_id: faker.helpers.arrayElement(sessionIds),
                start_time: start_date,
                end_time: end_date,
            };

            const insertQuery = {
                text: 'INSERT INTO "session_course" (session_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING id',
                values: Object.values(session_course),
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
