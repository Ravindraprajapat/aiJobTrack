import type { Request, Response } from "express";
import { parseJobWithAI, generateSuggestions } from "../service/aiService.js";
import Application from "../models/applicationModel.js";

// ✨ Generate resume bullet suggestions from JD
export const getSuggestions = async (req: any, res: Response) => {
  try {
    const { jdText } = req.body;
    if (!jdText) return res.status(400).json({ message: "JD text required" });

    const suggestions = await generateSuggestions(jdText);
    console.log("SUGGESTIONS RESULT:", suggestions);
    return res.status(200).json({ suggestions });
  } catch (error: any) {
    console.log("SUGGESTIONS ERROR:", error.message);
    return res.status(500).json({ message: "Suggestion generation failed", error: error.message });
  }
};

// 🔥 Extract purely from AI, no saving yet
export const parseApplicationDetails = async (req: any, res: Response) => {
  try {
    const { jdText } = req.body;

    if (!jdText) {
      return res.status(400).json({ message: "JD text required" });
    }

    const aiData = await parseJobWithAI(jdText);

    return res.status(200).json(aiData);
  } catch (error: any) {
    console.log("🔥 ERROR:", error);
    return res.status(500).json({
      message: "Parsing Error",
      error: error.message,
    });
  }
};

// 🔥 Create (Explicit Save)
export const createApplication = async (req: any, res: Response) => {
  try {
    const {
      company,
      role,
      status,
      skills,
      niceToHaveSkills,
      seniority,
      location,
      jdText,
      jdLink,
      suggestions,
      notes,
      salaryRange
    } = req.body;

    const app = await Application.create({
      userId: req.userId || "testUser",
      company: company || "Unknown",
      role: role || "Unknown",
      skills: skills || [],
      niceToHaveSkills: niceToHaveSkills || [],
      seniority: seniority || "",
      location: location || "",
      suggestions: suggestions || [],
      jdText: jdText || "",
      jdLink: jdLink || "",
      notes: notes || "",
      salaryRange: salaryRange || "",
      status: status || "Applied",
    });

    return res.status(201).json(app);

  } catch (error: any) {
    console.log("🔥 ERROR:", error);

    return res.status(500).json({
      message: "Create Application Error",
      error: error.message,
    });
  }
};

// 📥 Get all applications
export const getApplications = async (req: any, res: Response) => {
  try {
    const apps = await Application.find({ userId: req.userId });

    return res.status(200).json(apps);
  } catch (error) {
    return res.status(500).json({ message: "Fetch error" });
  }
};

// 🔄 Update (Drag & Drop or Edit Details)
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await Application.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // ✅ FIX: null check
    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Update error" });
  }
};

// ❌ Delete
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Delete error" });
  }
};