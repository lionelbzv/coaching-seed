import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

faker.locale = 'en_US';

/**
 * Populate session_type
 * @returns Promise<string[]>
 */
export async function populateSessionTypes(): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from session_type table
        await client.query('DELETE FROM "session_type"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "session_type_id_seq" RESTART WITH 1');

        // Insert 12 fake session_types
        const name = ['Yoga', 'Strength', 'Pilates', 'HIIT', 'Boxing', 'Running', 'Meditation', 'Dance', 'Nutrition', 'Mobility', 'Injury rehab', 'Sports-specific'];
        for (let i = 0; i < 12; i++) {
            const session_type = {
                name: name[i],
                description: faker.lorem.paragraph()
            };

            const insertQuery = {
                text: 'INSERT INTO "session_type" (name, description) VALUES ($1, $2) RETURNING id',
                values: Object.values(session_type),
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
