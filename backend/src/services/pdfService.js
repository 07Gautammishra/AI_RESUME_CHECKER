import uploadPdf from "../middleware/upload";
import ApiError from "../utils/ApiError";
import {PDFParse} from "pdf-parse";

async function extractTextFromPdf(fileBuffer) {
    let parser;
    try {
        parser= new PDFParse({data: fileBuffer});
        const result = await parser.getText();
        const text = (result.text || '').trim();

        if (!text || text.length < 50) {
            throw ApiError.badRequest('The uploaded PDF does not contain enough readable text.');
        }
        return {
            text,
            mata:{
                numPages: result.pages.length ?? result.numpages ?? 0,
            },
        };
    } catch (error) {
        if(error.isOperational){
            throw error;
        }
        throw ApiError.badRequest('Failed to parse PDF.');
    } finally {
        try {
            await parser?.destroy();
        } catch (destroyError) {
            console.error('Error destroying PDF parser:', destroyError);
        }
    }
}

export { uploadPdf, extractTextFromPdf };