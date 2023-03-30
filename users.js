"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.populateUsers = void 0;
var database_1 = require("./database");
var faker_1 = require("@faker-js/faker");
var bcrypt_1 = require("bcrypt");
faker_1.faker.locale = 'en_US';
/**
 * Populate user
 * @returns Promise<string[]>
 */
function populateUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var client, ids, owner, i, user, insertQuery, result, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, database_1.pool.connect()];
                case 1:
                    client = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 10, 11, 12]);
                    ids = [];
                    // Delete existing data from user table
                    return [4 /*yield*/, client.query('DELETE FROM "user"')];
                case 3:
                    // Delete existing data from user table
                    _b.sent();
                    // Reset the auto-increment counter
                    return [4 /*yield*/, client.query('ALTER SEQUENCE "user_id_seq" RESTART WITH 1')];
                case 4:
                    // Reset the auto-increment counter
                    _b.sent();
                    owner = ['lionel.bouzonville@forestadmin.com', 'louis@forestadmin.com', 'erlich.bachman@forestadmin.com', undefined];
                    i = 0;
                    _b.label = 5;
                case 5:
                    if (!(i < 100)) return [3 /*break*/, 9];
                    _a = {
                        first_name: faker_1.faker.name.firstName(),
                        last_name: faker_1.faker.name.lastName(),
                        email: faker_1.faker.internet.email(),
                        photo: faker_1.faker.image.people(undefined, undefined, true)
                    };
                    return [4 /*yield*/, (0, bcrypt_1.hash)(faker_1.faker.internet.password(), 10)];
                case 6:
                    user = (_a.password_hash = _b.sent(),
                        _a.owner = faker_1.faker.helpers.arrayElement(owner),
                        _a.created_at = faker_1.faker.date.past(1),
                        _a.updated_at = faker_1.faker.date.recent(),
                        _a);
                    insertQuery = {
                        text: 'INSERT INTO "user" (first_name, last_name, email, photo, password_hash, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
                        values: Object.values(user)
                    };
                    return [4 /*yield*/, client.query(insertQuery)];
                case 7:
                    result = _b.sent();
                    ids.push(result.rows[0].id.toString());
                    _b.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 5];
                case 9: return [2 /*return*/, ids];
                case 10:
                    error_1 = _b.sent();
                    throw error_1;
                case 11:
                    client.release();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.populateUsers = populateUsers;
