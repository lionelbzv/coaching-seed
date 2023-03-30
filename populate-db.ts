import { populateUsers } from './users';
import { populateCoaches } from './coaches';
import { populateSessionTypes } from './sessionTypes';
import { populateSessions } from './sessions';
import { populateSessionCourses } from './sessionCourses';
import { populateBookings } from './bookings';
import { populateCoachSkills } from './coachSkills';
import { populateComments } from './comments';

import { pool } from './database';

(async () => {
  try {
    process.stdout.write('Starting populate the database...');

    const userIds = await populateUsers();
    process.stdout.write('.');
    const coachIds = await populateCoaches();
    process.stdout.write('.');
    const sessionTypeIds = await populateSessionTypes();
    process.stdout.write('.');
    const sessionIds = await populateSessions(coachIds, sessionTypeIds);
    process.stdout.write('.');
    const sessionCourseIds = await populateSessionCourses(sessionIds);
    process.stdout.write('.');
    const bookingIds = await populateBookings(sessionCourseIds, userIds);
    process.stdout.write('.');
    const coachSkillsIds = await populateCoachSkills(coachIds, sessionTypeIds);
    process.stdout.write('.');
    const commentIds = await populateComments(userIds, sessionIds);
    process.stdout.write('.');
  
    console.log(' the database has been populated ! 👏');
  } catch (err) {
    console.error('Error while populating the database:', err);
  } finally {
    await pool.end();
  }
})();
