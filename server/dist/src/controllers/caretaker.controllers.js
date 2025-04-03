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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const types_1 = require("../utils/types");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against the schema
        const validationResult = types_1.SignupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.flatten().fieldErrors,
            });
        }
        const { username, email, password } = validationResult.data;
        // Check if email already exists
        const existingCaretaker = yield db_1.db
            .select()
            .from(schema_1.caretakersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.caretakersTable.email, email))
            .execute();
        if (existingCaretaker.length > 0) {
            return res.status(409).json({ error: "Email already in use" });
        }
        // Hash password
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        // Insert new caretaker into database
        const [newCaretaker] = yield db_1.db
            .insert(schema_1.caretakersTable)
            .values({
            username,
            email,
            password: hashedPassword,
        })
            .returning()
            .execute();
        return res.status(201).json({
            message: "User created successfully",
            newCaretaker
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against the schema
        const validationResult = types_1.SigninSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.flatten().fieldErrors,
            });
        }
        const { email, password } = validationResult.data;
        // Check if user exists
        const [caretaker] = yield db_1.db
            .select()
            .from(schema_1.caretakersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.caretakersTable.email, email))
            .execute();
        if (!caretaker) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Compare passwords
        const isPasswordValid = yield bcryptjs_1.default.compare(password, caretaker.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        return res.status(200).json({
            message: "Login successful",
            caretaker
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.signin = signin;
