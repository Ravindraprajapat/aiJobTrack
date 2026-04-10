import mongoose, { Document, Schema } from "mongoose";


export interface IApplication extends Document {
  userId: string;
  company: string;
  role: string;
  status: "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected";
  skills: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  jdText?: string;
  jdLink?: string;
  reminderDate?: Date;
  suggestions: string[];
  notes?: string;
  salaryRange?: string;
  dateApplied: Date;
}


const applicationSchema: Schema<IApplication> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },

    skills: {
      type: [String],
      default: [],
    },

    niceToHaveSkills: {
      type: [String],
      default: [],
    },

    seniority: {
      type: String,
    },

    location: {
      type: String,
    },

    jdText: {
      type: String,
    },

    jdLink: {
      type: String,
    },

    reminderDate: {
      type: Date,
    },

    suggestions: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
    },

    salaryRange: {
      type: String,
    },

    dateApplied: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);

export default Application;