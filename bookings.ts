import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

faker.locale = 'en_US';

/**
 * Populate booking
 * @returns Promise<string[]>
 */
export async function populateBookings(sessionCourseIds, userIds): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from booking table
        await client.query('DELETE FROM "booking"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "booking_id_seq" RESTART WITH 1');

        // Insert 50000 fake booking
        for (let i = 0; i < 50000; i++) {
            const booking = {
                user_id: faker.helpers.arrayElement(userIds),
                session_course_id: faker.helpers.arrayElement(sessionCourseIds),
                present: faker.datatype.boolean(),
            };

            const insertQuery = {
                text: 'INSERT INTO "booking" (user_id, session_course_id, present) VALUES ($1, $2, $3) RETURNING id',
                values: Object.values(booking),
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
