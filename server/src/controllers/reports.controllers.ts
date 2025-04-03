import { Request, Response } from "express";
import { db } from "../db";
import { reportsTable, patientsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { ReportSchema } from "../utils/types";

export const create = async (req: Request, res: Response) => {
  try {
    // Validate request body against the schema
    const validationResult = ReportSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const reportData = validationResult.data;

    // Create new report
    const [newReport] = await db
      .insert(reportsTable)
      .values({
        symptoms: reportData.symptoms,
        detailedAnalysis: reportData.detailedAnalysis,
        precautions: reportData.precautions,
        typeOfDoctors: reportData.typeOfDoctors,
        predictions: reportData.predictions,
        patientId: reportData.patientId,
        caretakerId: reportData.caretakerId,
        doctorId: reportData.doctorId,
        verified: reportData.verified,
      })
      .returning()
      .execute();

    return res.status(201).json({
      message: "Report created successfully",
      report: newReport
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const reports = await db
      .select()
      .from(reportsTable)
      .execute();

    return res.status(200).json({
      message: "Reports retrieved successfully",
      reports
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

    const [report] = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.id, id))
      .execute();

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    return res.status(200).json({
      message: "Report retrieved successfully",
      report
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const [report] = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.id, id))
      .execute();

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Update report
    const [updatedReport] = await db
      .update(reportsTable)
      .set({
        verified: req.body.verified,
      })
      .where(eq(reportsTable.id, id))
      .returning()
      .execute();

    return res.status(200).json({
      message: "Report updated successfully",
      report: updatedReport
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

    const reports = await db
      .select({
        id: reportsTable.id,
        patientId: reportsTable.patientId,
        patient: {
          name: patientsTable.name,
        },
        detailedAnalysis: reportsTable.detailedAnalysis,
        verified: reportsTable.verified,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .leftJoin(patientsTable, eq(reportsTable.patientId, patientsTable.id))
      .where(eq(reportsTable.caretakerId, caretakerId))
      .orderBy(reportsTable.createdAt)
      .execute();

    return res.status(200).json({
      message: "Reports retrieved successfully",
      reports
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
      return res.status(400).json({ error: "Invalid caretaker ID format" });
    }

    const reports = await db
      .select({
        id: reportsTable.id,
        patientId: reportsTable.patientId,
        patient: {
          name: patientsTable.name,
        },
        detailedAnalysis: reportsTable.detailedAnalysis,
        verified: reportsTable.verified,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .leftJoin(patientsTable, eq(reportsTable.patientId, patientsTable.id))
      .where(eq(reportsTable.doctorId, doctorId))
      .orderBy(reportsTable.createdAt)
      .execute();

    return res.status(200).json({
      message: "Reports retrieved successfully",
      reports
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};