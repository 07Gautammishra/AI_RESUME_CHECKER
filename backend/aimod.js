import { GoogleGenAI } from "@google/genai";
import { ENV } from "./src/config/ENV.js";

const ai = new GoogleGenAI({ apiKey: ENV.geminiApi });

async function listModels() {
    try {
        const response = await ai.models.list();
        for await (const model of response) {
            console.log(model.name);
        }
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();