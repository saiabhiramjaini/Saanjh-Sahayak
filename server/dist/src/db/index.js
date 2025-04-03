"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = (0, neon_http_1.drizzle)(process.env.DATABASE_URL);
