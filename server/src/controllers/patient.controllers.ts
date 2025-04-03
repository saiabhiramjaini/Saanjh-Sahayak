import { Request, Response } from "express";
import { db } from "../db";
import { patientsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { PatientSchema } from "../utils/types";

export const create = async (req: Request, res: Response) => {
  try {
    // Validate request body against the schema
    const validationResult = PatientSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const patientData = validationResult.data;

    // Create new patient
    const [newPatient] = await db
      .insert(patientsTable)
      .values({
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        bloodGroup: patientData.bloodGroup,
        contact: patientData.contact,
        medicalHistory: patientData.medicalHistory,
        oldAgeHomeId: patientData.oldAgeHomeId,
        assignedcaretakerId: patientData.assignedcaretakerId,
        assignedDoctorId: patientData.assignedDoctorId,
      })
      .returning()
      .execute();

    return res.status(201).json({
      message: "Patient created successfully",
      patient: newPatient
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const patients = await db
      .select()
      .from(patientsTable)
      .execute();

    return res.status(200).json({
      message: "Patients retrieved successfully",
      patients
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

    const [patient] = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, id))
      .execute();

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.status(200).json({
      message: "Patient retrieved successfully",
      patient
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getByOldAgeHomeId = async (req: Request, res: Response) => {
  try {
    const oldAgeHomeId = parseInt(req.params.oldAgeHomeId);

    if (isNaN(oldAgeHomeId)) {
      return res.status(400).json({ error: "Invalid old age home ID format" });
    }

    const patients = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.oldAgeHomeId, oldAgeHomeId))
      .execute();

    return res.status(200).json({
      message: "Patients retrieved successfully",
      patients
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getByCaretakerId = async (req: Request, res: Response) => {
  try {
    const caretakerId = parseInt(req.params.caretakerId);

    if (isNaN(caretakerId)) {
      return res.status(400).json({ error: "Invalid caretaker ID format" });
    }

    const patients = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.assignedcaretakerId, caretakerId))
      .execute();

    return res.status(200).json({
      message: "Patients retrieved successfully",
      patients
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getByDoctorId = async (req: Request, res: Response) => {
  try {
    const doctorId = parseInt(req.params.doctorId);

    if (isNaN(doctorId)) {
      return res.status(400).json({ error: "Invalid doctor ID format" });
    }

    const patients = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.assignedDoctorId, doctorId))
      .execute();

    return res.status(200).json({
      message: "Patients retrieved successfully",
      patients
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};