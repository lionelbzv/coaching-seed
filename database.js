"use strict";
exports.__esModule = true;
exports.pool = void 0;
var pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: 'localhost',
    port: 5433,
    database: 'coaching_hub',
    user: 'user',
    password: 'password',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000 // how long to wait before timing out when connecting a new client
});
