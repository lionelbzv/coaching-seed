import { pool } from './database';
import { faker } from '@faker-js/faker';
import { QueryResult } from 'pg';

faker.locale = 'en_US';

/**
 * Populate coach_skill
 * @returns Promise<string[]>
 */
export async function populateCoachSkills(coachIds, sessionTypeIds): Promise<string[]> {
    const client = await pool.connect();

    try {
        const ids: string[] = [];

        // Delete existing data from coach_skill table
        await client.query('DELETE FROM "coach_skill"');

        // Reset the auto-increment counter
        await client.query('ALTER SEQUENCE "coach_skill_id_seq" RESTART WITH 1');

        // Insert 300 fake coach_skill
        // @todo avoid multiple sessionTypeId for same coachId
        for (let i = 0; i < 300; i++) {
            const coach_skill = {
                coach_id: faker.helpers.arrayElement(coachIds),
                session_type_id: faker.helpers.arrayElement(sessionTypeIds),
                skill_level: faker.datatype.number({ min: 4, max: 5 }),
            };

            const insertQuery = {
                text: 'INSERT INTO "coach_skill" (coach_id, session_type_id, skill_level) VALUES ($1, $2, $3) RETURNING id',
                values: Object.values(coach_skill),
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
