import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

const buildPrompt = (jdText: string) => `
You are a JSON API. Return ONLY a valid JSON object. No markdown, no backticks, no explanation.

Extract from this job description and return exactly this structure:

{
  "company": "company name",
  "role": "job title",
  "seniority": "Entry or Mid or Senior or Lead",
  "location": "city country or Remote",
  "salaryRange": "salary if mentioned else empty string",
  "skills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill3"],
  "suggestions": [
    "Built X using Y resulting in Z% improvement",
    "Designed X with Y reducing Z by N%",
    "Implemented X using Y increasing Z by N%",
    "Optimized X with Y cutting Z by N%"
  ]
}

Rules for suggestions array:
- Exactly 4 bullet points
- Each starts with a past-tense verb: Built, Designed, Implemented, Optimized, Led, Automated, Delivered, Reduced
- Each mentions a specific tool or technology from the job description
- Each includes a measurable result like "by 40%" or "from 2hrs to 10min"

Job Description:
${jdText}
`;

export const parseJobWithAI = async (jdText: string) => {
  const fallback = {
    company: "", role: "", seniority: "", location: "",
    salaryRange: "", skills: [], niceToHaveSkills: [], suggestions: []
  };

  try {
    const result = await model.generateContent(buildPrompt(jdText));
    let raw = result.response.text();
    console.log("GEMINI RAW:", raw);

    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // extract JSON object in case there's any surrounding text
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      console.log("NO JSON FOUND IN RESPONSE");
      return fallback;
    }

    const parsed = JSON.parse(match[0]);
    console.log("PARSED:", parsed);
    return { ...fallback, ...parsed };

  } catch (error: any) {
    console.log("GEMINI ERROR:", error.message);
    return fallback;
  }
};

export const generateSuggestions = async (jdText: string): Promise<string[]> => {
  try {
    const result = await model.generateContent(
      `Return ONLY a raw JSON array of 4 resume bullet points. No markdown, no backticks.
Each bullet: past-tense verb + specific tool from JD + measurable result.
Example format: ["Built X with Y reducing Z by 40%", ...]
Job Description: ${jdText}`
    );

    let raw = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
