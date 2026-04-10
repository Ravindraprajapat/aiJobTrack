import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API KEY:", process.env.OPENAI_API_KEY);


const buildPrompt = (jdText: string) => `
Return ONLY valid JSON. No explanation. No markdown. No backticks.

Analyze this Job Description and return a JSON object with these exact fields:

{
  "company": "company name from JD",
  "role": "exact job title from JD",
  "skills": ["required skill 1", "required skill 2"],
  "niceToHaveSkills": ["optional skill 1"],
  "seniority": "Entry | Mid | Senior | Lead",
  "location": "city, country or Remote",
  "salaryRange": "e.g. 20 LPA or 100k USD",
  "suggestions": [
    "Strong resume bullet 1",
    "Strong resume bullet 2",
    "Strong resume bullet 3",
    "Strong resume bullet 4"
  ]
}

Rules for suggestions:
- Generate EXACTLY 4 resume bullet points
- Each bullet MUST start with a strong past-tense action verb
- Each bullet MUST mention a specific skill or technology from the JD
- Each bullet MUST include a measurable result

Job Description:
${jdText}
`;



export const generateSuggestions = async (jdText: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini" , // ✅ latest model
      messages: [
        {
          role: "user",
          content: `You are a professional resume writer. Return ONLY JSON array.

Each bullet MUST:
- Start with past tense verb
- Include tool/tech
- Include measurable result

Format:
["bullet1","bullet2","bullet3","bullet4"]

Job Description:
${jdText}`,
        },
      ],
      temperature: 0.4,
    });

    let raw = completion.choices[0]?.message?.content || "[]";

    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("SUGGESTIONS RAW:", raw);

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];

  } catch (err) {
    console.log("SUGGESTIONS ERROR:", err);
    return [];
  }
};



export const streamJobParseWithAI = async (jdText: string) => {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: buildPrompt(jdText),
      },
    ],
    stream: true,
  });

  return stream; // frontend handle karega
};



export const parseJobWithAI = async (jdText: string) => {
  try {
    console.log("parseJobWithAI");

    const completion = await openai.chat.completions.create({
      model:"gpt-4o-mini" ,
      messages: [
        {
          role: "user",
          content: buildPrompt(jdText),
        },
      ],
      temperature: 0.2,
    });

    let raw = completion.choices[0]?.message?.content || "";

    fs.writeFileSync("ai-raw.txt", raw);

    console.log("RAW RESPONSE:", raw);

    
    const match = raw.match(/\{[\s\S]*\}/);
    let text = match ? match[0] : "{}";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("CLEAN JSON:", text);

    try {
      const parsed = JSON.parse(text);
      fs.writeFileSync("ai-success.json", JSON.stringify(parsed, null, 2));
      return parsed;
    } catch (err: any) {
      fs.writeFileSync(
        "ai-error.log",
        "PARSE ERROR: " + text + "\nERR: " + err.message + "\n"
      );

      return fallback();
    }

  } catch (error: any) {
    fs.writeFileSync("ai-error.log", "ERROR: " + error.stack + "\n");
    console.log("OPENAI ERROR:", error.message);

    return fallback();
  }
};



const fallback = () => ({
  company: "Unknown",
  role: "Unknown",
  skills: [],
  niceToHaveSkills: [],
  seniority: "",
  location: "",
  salaryRange: "",
  suggestions: [],
});

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// import fs from "fs";

// dotenv.config();

// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string );
// console.log("API KEY:", process.env.GEMINI_API_KEY);

// const buildPrompt = (jdText: string) => `
// Return ONLY valid JSON. No explanation. No markdown. No backticks.

// Analyze this Job Description and return a JSON object with these exact fields:

// {
//   "company": "company name from JD",
//   "role": "exact job title from JD",
//   "skills": ["required skill 1", "required skill 2"],
//   "niceToHaveSkills": ["optional skill 1"],
//   "seniority": "Entry | Mid | Senior | Lead",
//   "location": "city, country or Remote",
//   "salaryRange": "e.g. 20 LPA or 100k USD",
//   "suggestions": [
//     "Strong resume bullet 1",
//     "Strong resume bullet 2",
//     "Strong resume bullet 3",
//     "Strong resume bullet 4"
//   ]
// }

// Rules for suggestions:
// - Generate EXACTLY 4 resume bullet points
// - Each bullet MUST start with a strong past-tense action verb (Built, Designed, Optimized, Led, Reduced, Implemented, Automated, Delivered, Architected, Increased)
// - Each bullet MUST mention a specific skill or technology from the JD
// - Each bullet MUST include a measurable result (e.g. reduced latency by 40%, improved throughput by 3x)
// - Do NOT write generic bullets like "Worked on backend systems"

// Job Description:
// ${jdText}
// `;

// export const generateSuggestions = async (jdText: string): Promise<string[]> => {
//   // FIX: Model initialization aur correct model name
//   const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  
//   const result = await model.generateContent({
//     contents: [{
//       role: "user",
//       parts: [{
//         text: `You are a professional resume writer. Read this job description and return ONLY a raw JSON array of 4 resume bullet points. No markdown, no explanation, no backticks.

// Each bullet MUST:
// - Start with a past-tense action verb (Built, Optimized, Designed, Led, Reduced, Implemented, Automated, Delivered)
// - Name a specific tool or technology from the JD
// - Include a measurable result (e.g. "reduced build time by 50%", "improved API response by 3x")

// Return ONLY this format:
// ["bullet 1", "bullet 2", "bullet 3", "bullet 4"]

// Job Description:
// ${jdText}`
//       }]
//     }],
//   });

//   // ✅ FIX: correct extraction using response.text()
//   let raw = result.response.text() || "[]";

//   raw = raw
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   console.log("SUGGESTIONS RAW:", raw);

//   try {
//     const parsed = JSON.parse(raw);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch (err) {
//     console.log("SUGGESTIONS PARSE ERROR:", raw);
//     return [];
//   }
// };

// export const streamJobParseWithAI = async (jdText: string) => {
//   // FIX: Model initialization
//   const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
//   return await model.generateContentStream({
//     contents: [{ role: "user", parts: [{ text: buildPrompt(jdText) }] }],
//   });
// };

// export const parseJobWithAI = async (jdText: string) => {
//   try {
//     console.log("parseJobWithAI")
//     // FIX: Model initialization
//     const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: buildPrompt(jdText) }] }],
//     });
//     fs.writeFileSync("ai-raw.txt", result.response.text() || "");

//     // ✅ extract text using response.text()
//     let raw = result.response.text() || "";

//     console.log("RAW RESPONSE:", raw);

//     // ✅ extract only JSON
//     const match = raw.match(/\{[\s\S]*\}/);
//     let text = match ? match[0] : "{}";

//     text = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     console.log("CLEAN JSON:", text);

//     try {
//       const parsed = JSON.parse(text);
//       fs.writeFileSync("ai-success.json", JSON.stringify(parsed, null, 2));
//       return parsed;
//     } catch (err: any) {
//       fs.writeFileSync("ai-error.log", "PARSE ERROR: " + text + "\nERR: " + err.message + "\n");
//       console.log("PARSE ERROR:", text);

//       return {
//         company: "Unknown",
//         role: "Unknown",
//         skills: [],
//         niceToHaveSkills: [],
//         seniority: "",
//         location: "",
//         salaryRange: "",
//         suggestions: []
//       };
//     }

//   } catch (error: any) {
//     fs.writeFileSync("ai-error.log", "ERROR: " + error.stack + "\n");
//     console.log("GEMINI ERROR:", error.message);

//     // ✅ FIX: always return fallback
//     return {
//       company: "Unknown",
//       role: "Unknown",
//       skills: [],
//       niceToHaveSkills: [],
//       seniority: "",
//       location: "",
//       salaryRange: "",
//       suggestions: []
//     };
//   }
// };