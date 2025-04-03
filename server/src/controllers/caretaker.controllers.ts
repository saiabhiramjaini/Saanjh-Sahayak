import { Request, Response } from "express";
import { db } from "../db";
import { caretakersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignupSchema, SigninSchema } from "../utils/types";
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body against the schema
    const validationResult = SignupSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      
      });
    }

    const { username, email, password } = validationResult.data;

    // Check if email already exists
    const existingCaretaker = await db
      .select()
      .from(caretakersTable)
      .where(eq(caretakersTable.email, email))
      .execute();

    if (existingCaretaker.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS!) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new caretaker into database
    const [newCaretaker] = await db
      .insert(caretakersTable)
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

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    // Validate request body against the schema
    const validationResult = SigninSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validationResult.data;

    // Check if user exists
    const [caretaker] = await db
      .select()
      .from(caretakersTable)
      .where(eq(caretakersTable.email, email))
      .execute();

    if (!caretaker) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, caretaker.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      caretaker
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};