
'use server';
/**
 * @fileOverview Extracts name and Aadhaar number from an Aadhaar card image.
 *
 * - extractAadhaarInfo - A function that handles the Aadhaar information extraction.
 * - ExtractAadhaarInfoInput - The input type for the extractAadhaarInfo function.
 * - ExtractAadhaarInfoOutput - The return type for the extractAadhaarInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractAadhaarInfoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an Aadhaar card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractAadhaarInfoInput = z.infer<typeof ExtractAadhaarInfoInputSchema>;

const ExtractAadhaarInfoOutputSchema = z.object({
  name: z.string().describe('The full name of the cardholder.'),
  aadhaarNumber: z.string().describe('The 12-digit Aadhaar number.'),
});
export type ExtractAadhaarInfoOutput = z.infer<typeof ExtractAadhaarInfoOutputSchema>;

export async function extractAadhaarInfo(input: ExtractAadhaarInfoInput): Promise<ExtractAadhaarInfoOutput> {
  return extractAadhaarInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractAadhaarInfoPrompt',
  input: { schema: ExtractAadhaarInfoInputSchema },
  output: { schema: ExtractAadhaarInfoOutputSchema },
  prompt: `You are an expert OCR system. Analyze the provided image of an Indian Aadhaar card and extract the cardholder's full name and the 12-digit Aadhaar number.

  Image: {{media url=photoDataUri}}

  Extract the name and the 12-digit Aadhaar number. The Aadhaar number might have spaces, please remove them.
  `,
});

const extractAadhaarInfoFlow = ai.defineFlow(
  {
    name: 'extractAadhaarInfoFlow',
    inputSchema: ExtractAadhaarInfoInputSchema,
    outputSchema: ExtractAadhaarInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
