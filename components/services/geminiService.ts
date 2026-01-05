import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_PROMPT = `You are "Compilance Lens by Samektra," a code compliance inspector specializing in NFPA, IBC, IFC, NEC, CMS, The Joint Commission, ADA, ANSI, and Georgia Title 25.
You analyze ONLY what is visually verifiable in the provided image(s). Do not invent unseen context.

Critical output rules:
- Output MUST be a single valid JSON object that conforms to the schema in the user message.
- Do not include prose, markdown, or code fences outside the JSON.
- If unsure, set "confidence" appropriately and prefer “unknown” over guessing.
- If nothing is clearly visible, return an empty violations array and still include "summary" and "whatToLookFor".
- Coordinates must be tight bounding boxes in the image’s native pixel space.
- Use the SPECIAL INSTRUCTIONS exactly as written when applicable.`;

const USER_PROMPT_TEMPLATE = `Analyze the attached image. Ground your findings ONLY in what’s visible.

Your response MUST be a single JSON object that conforms to this schema:

{
  "type": "object",
  "required": ["schemaVersion", "summary", "image", "violations", "whatToLookFor"],
  "properties": {
    "schemaVersion": { "type": "string", "enum": ["1.0"] },

    "summary": {
      "type": "object",
      "required": ["text", "confidence"],
      "properties": {
        "text": { "type": "string", "description": "One-sentence description of the scene." },
        "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },

    "image": {
      "type": "object",
      "required": ["width", "height"],
      "properties": {
        "width": { "type": "integer", "minimum": 1 },
        "height": { "type": "integer", "minimum": 1 }
      }
    },

    "violations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "title", "code", "severity", "description", "location", "coordinates", "confidence", "remediation", "references"],
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "code": { "type": "string", "description": "e.g., 'NFPA 10', 'NFPA 80', 'NFPA 72', 'NEC', 'ADA', 'ANSI'." },
          "severity": { "type": "string", "enum": ["Low", "Medium", "High"] },
          "description": { "type": "string" },
          "location": { "type": "string" },
          "coordinates": {
            "type": "object",
            "required": ["x1","y1","x2","y2"],
            "properties": {
              "x1": { "type": "integer", "minimum": 0 },
              "y1": { "type": "integer", "minimum": 0 },
              "x2": { "type": "integer", "minimum": 0 },
              "y2": { "type": "integer", "minimum": 0 }
            },
            "description": "Tight bbox in native pixels: top-left (x1,y1), bottom-right (x2,y2)."
          },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "remediation": { "type": "string" },
          "references": { "type": "array", "items": { "type": "string" }, "description": "Cite sections if known; keep short." }
        }
      }
    },

    "whatToLookFor": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["item", "details"],
        "properties": {
          "item": { "type": "string" },
          "details": { "type": "string" }
        }
      }
    }
  }
}

SPECIAL INSTRUCTIONS FOR COMMON DEFICIENCIES (apply when visible):
- Unsecured Fire Extinguisher: If an extinguisher is not in a bracket/cabinet, add a High severity violation under NFPA 10. Description MUST mention Section 6.1.3.8.1 and why unsecured is hazardous.
- Improper Use of Extension Cords: If an extension cord passes through a wall/ceiling/floor penetration, add High under NEC. Explain flexible cords aren’t permanent wiring and cannot route through holes; fire hazard risk.
- Damaged Devices: If a smoke detector or other fire-safety device appears damaged, describe the damage and the functional risk.
- Sprinkler Heads: Note corrosion, paint, heavy loading (dust/debris), or obstructed spray pattern by fixed objects.
- Infection Control Risks: In healthcare context, flag discarded bottles/unknown substances with hygiene rationale.
- Fire Door Labels: If a fire door/frame label is visible, add an entry with code NFPA 80 and severity Low stating:
  "A fire rating label is visible. This indicates the component is part of a fire-rated assembly. It is not a deficiency, but its rating and appropriateness for the location must be verified against the facility's Life Safety plans. Minor scrapes on the label are not a deficiency."
  Also add related “whatToLookFor” checks for the full door assembly.
- Hazardous Room Doors: If door indicates a hazardous area (e.g., biohazard/Soiled Utility) and latch looks disengaged, add High. Explain containment risk; doors must be self-closing and positively latching. Add “Room Pressure Verification” and “Self-Closing Mechanism” items to whatToLookFor.
- Fire Extinguisher Height: If extinguisher is mounted, add a verification note: top to 60 in OK per NFPA 10 but ADA reach often ≤48 in to handle. Add a “measure height to handle” item.

MANDATORY “whatToLookFor” for Fire Door Labels:
- Proper Gaps & Clearances
- Positive Latching Hardware
- Functioning Self-Closing Device
- Intact Seals (Smoke/Intumescent)
- No Unapproved Hardware or Modifications

If nothing is clearly noncompliant, set violations to [] but still provide 4–8 relevant “whatToLookFor” items based on context.

Return only the JSON object (no markdown).`;

export const analyzeComplianceImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Debugging: Log (safely) if key is present
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing in environment variables.");
      throw new Error("System configuration error: API Key missing.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains metadata header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: USER_PROMPT_TEMPLATE
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for more deterministic/factual output
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Empty response from AI");
    }

    // Clean Markdown code blocks if present
    const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();

    try {
      const data: AnalysisResult = JSON.parse(cleanJson);
      // Basic validation
      if (!data.summary || !Array.isArray(data.violations)) {
        throw new Error("Invalid JSON structure returned");
      }
      return data;
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      throw new Error("Failed to parse compliance analysis results.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = error.message || error.toString();

    // Check if the error message is actually a stringified JSON object (as seen in your screenshot)
    if (typeof errorMessage === 'string' && (errorMessage.includes('{') || errorMessage.includes('error'))) {
       try {
         // Attempt to extract the JSON part if mixed with text
         const jsonMatch = errorMessage.match(/\{.*\}/s);
         if (jsonMatch) {
            const parsedError = JSON.parse(jsonMatch[0]);
            if (parsedError.error && parsedError.error.message) {
               errorMessage = parsedError.error.message;
            }
         }
       } catch (e) {
         // If parsing fails, keep original message
       }
    }

    // Provide user-friendly messages for common codes
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("Daily AI usage limit reached. Please try again later or check your API key plan.");
    }
    if (errorMessage.includes("403") || errorMessage.includes("API key")) {
        throw new Error("Invalid API Key. Please check your configuration.");
    }
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        // This handles the "model not found" case specifically
        throw new Error("AI Model unavailable. Please redeploy to ensure you are using the latest code.");
    }
    
    throw new Error(errorMessage);
  }
};