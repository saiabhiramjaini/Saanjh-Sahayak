import { Request, Response } from "express";
import { db } from "../db";
import { prescriptionsTable, reportsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { PrescriptionSchema } from "../utils/types";

export const create = async (req: Request, res: Response) => {
  try {
    // Validate request body against the schema
    const validationResult = PrescriptionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const prescriptionData = validationResult.data;

    // Create new prescription
    const [newPrescription] = await db
      .insert(prescriptionsTable)
      .values({
        patientId: prescriptionData.patientId,
        doctorId: prescriptionData.doctorId,
        reportId: prescriptionData.reportId,
        medicines: prescriptionData.medicines,
      })
      .returning()
      .execute();

    // Update the report's verified status to true
    await db
      .update(reportsTable)
      .set({ verified: true })
      .where(eq(reportsTable.id, prescriptionData.reportId))
      .execute();

    return res.status(201).json({
      message: "Prescription created successfully",
      prescription: newPrescription
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const prescriptions = await db
      .select()
      .from(prescriptionsTable)
      .execute();

    return res.status(200).json({
      message: "Prescriptions retrieved successfully",
      prescriptions
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

    const [prescription] = await db
      .select()
      .from(prescriptionsTable)
      .where(eq(prescriptionsTable.id, id))
      .execute();

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    return res.status(200).json({
      message: "Prescription retrieved successfully",
      prescription
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getByReportId = async (req: Request, res: Response) => {
  try {
    const reportId = parseInt(req.params.reportId);

    if (isNaN(reportId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const [prescription] = await db
      .select()
      .from(prescriptionsTable)
      .where(eq(prescriptionsTable.reportId, reportId))
      .execute();

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    return res.status(200).json({
      message: "Prescription retrieved successfully",
      prescription
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};