import { Request, Response } from "express";
import { db } from "../db";
import { doctorsTable } from "../db/schema";
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
    const existingDoctor = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.email, email))
      .execute();

    if (existingDoctor.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS!) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new doctor into database
    const [newDoctor] = await db
      .insert(doctorsTable)
      .values({
        username,
        email,
        password: hashedPassword
      })
      .returning({
        id: doctorsTable.id,
        username: doctorsTable.username,
        email: doctorsTable.email
      })
      .execute();

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor: {
        id: newDoctor.id,
        email: newDoctor.email,
        name: newDoctor.username
      }
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    console.log("Doctor signin attempt:", { email: req.body.email });
    
    // Validate request body against the schema
    const validationResult = SigninSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.flatten().fieldErrors);
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validationResult.data;

    // Check if user exists
    console.log("Querying doctor with email:", email);
    const [doctor] = await db
      .select({
        id: doctorsTable.id,
        username: doctorsTable.username,
        email: doctorsTable.email,
        password: doctorsTable.password,
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.email, email))
      .execute();

    if (!doctor) {
      console.log("No doctor found with email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Doctor found, verifying password");
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      console.log("Invalid password for doctor:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove password from response and format doctor data
    const { password: _, ...doctorData } = doctor;
    const responseData = {
      message: "Login successful",
      doctor: {
        id: doctorData.id,
        email: doctorData.email,
        name: doctorData.username,
      }
    };
    
    console.log("Login successful for doctor:", { email: doctorData.email, id: doctorData.id });
    return res.status(200).json(responseData);

  } catch (e: any) {
    console.error("Signin error:", e.message || e);
    console.error("Stack trace:", e.stack);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    // Fetch all doctors from the database
    const doctors = await db
      .select({
        id: doctorsTable.id,
        username: doctorsTable.username,
        email: doctorsTable.email,
        specialization: doctorsTable.specialization,
      })
      .from(doctorsTable)
      .execute();

    return res.status(200).json({
      message: "Doctors fetched successfully",
      doctors
    });
  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const [doctor] = await db
      .select({
        id: doctorsTable.id,
        username: doctorsTable.username,
        email: doctorsTable.email,
        specialization: doctorsTable.specialization,
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.id, id))
      .execute();

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json({
      message: "Doctor retrieved successfully",
      doctor
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};