import { Request, Response } from "express";
import { OldAgeHomeSchema } from "../utils/types";
import { db } from "../db";
import { oldAgeHomesTable, caretakersTable, doctorsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const create = async (req: Request, res: Response) => {
  try {
    const validationResult = OldAgeHomeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const oldAgeHomeData = validationResult.data;

    // Check if caretaker exists
    const [caretaker] = await db
      .select()
      .from(caretakersTable)
      .where(eq(caretakersTable.id, oldAgeHomeData.assignedCaretakerId))
      .execute();

    if (!caretaker) {
      return res.status(404).json({ error: "Caretaker not found" });
    }

    // Check if doctor exists
    const [doctor] = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, oldAgeHomeData.assignedDoctorId))
      .execute();

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if caretaker already has an old age home
    const [existingHome] = await db
      .select()
      .from(oldAgeHomesTable)
      .where(eq(oldAgeHomesTable.assignedcaretakerId, oldAgeHomeData.assignedCaretakerId))
      .execute();

    if (existingHome) {
      return res.status(409).json({ error: "Caretaker already has an assigned old age home" });
    }

    // Create new old age home
    const [newOldAgeHome] = await db
      .insert(oldAgeHomesTable)
      .values({
        name: oldAgeHomeData.name,
        phoneNumber: oldAgeHomeData.phoneNumber,
        address: oldAgeHomeData.address,
        city: oldAgeHomeData.city,
        state: oldAgeHomeData.state,
        pincode: oldAgeHomeData.pincode,
        currentOccupancy: oldAgeHomeData.currentOccupancy,
        assignedcaretakerId: oldAgeHomeData.assignedCaretakerId,
        assignedDoctorId: oldAgeHomeData.assignedDoctorId,
      })
      .returning()
      .execute();

    return res.status(201).json({
      message: "Old age home created successfully",
      oldAgeHome: newOldAgeHome
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

    const [oldAgeHome] = await db
      .select()
      .from(oldAgeHomesTable)
      .where(eq(oldAgeHomesTable.id, id))
      .execute();

    if (!oldAgeHome) {
      return res.status(404).json({ error: "Old age home not found" });
    }

    return res.status(200).json({
      message: "Old age home retrieved successfully",
      oldAgeHome
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

    const [oldAgeHome] = await db
      .select()
      .from(oldAgeHomesTable)
      .where(eq(oldAgeHomesTable.assignedcaretakerId, caretakerId))
      .execute();

    if (!oldAgeHome) {
      return res.status(404).json({ error: "No old age home found for this caretaker" });
    }

    return res.status(200).json({
      message: "Old age home retrieved successfully",
      oldAgeHome
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

    const oldAgeHomes = await db
      .select()
      .from(oldAgeHomesTable)
      .where(eq(oldAgeHomesTable.assignedDoctorId, doctorId))
      .execute();

    if (oldAgeHomes.length === 0) {
      return res.status(404).json({ error: "No old age homes found for this doctor" });
    }

    return res.status(200).json({
      message: "Old age homes retrieved successfully",
      oldAgeHomes, // Now returning an array
    });

  } catch (e: any) {
    console.error(`Error: ${e.message || e}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
