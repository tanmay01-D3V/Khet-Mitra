'use server';
/**
 * @fileOverview Analyzes a photo of a crop to identify potential diseases.
 *
 * - analyzeCropDiseaseFromImage - A function that handles the crop disease analysis process.
 * - AnalyzeCropDiseaseFromImageInput - The input type for the analyzeCropDiseaseFromImage function.
 * - AnalyzeCropDiseaseFromImageOutput - The return type for the analyzeCropDiseaseFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropDiseaseFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCropDiseaseFromImageInput = z.infer<typeof AnalyzeCropDiseaseFromImageInputSchema>;

const AnalyzeCropDiseaseFromImageOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected in the crop.'),
    likelyDisease: z.string().describe('The most likely disease affecting the crop, if any.'),
    confidenceLevel: z
      .number()
      .describe('The confidence level of the disease identification (0-1).'),
    suggestedActions: z
      .string()
      .describe('Suggested actions to take to address the identified disease.'),
  }),
});
export type AnalyzeCropDiseaseFromImageOutput = z.infer<typeof AnalyzeCropDiseaseFromImageOutputSchema>;

export async function analyzeCropDiseaseFromImage(
  input: AnalyzeCropDiseaseFromImageInput
): Promise<AnalyzeCropDiseaseFromImageOutput> {
  return analyzeCropDiseaseFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropDiseaseFromImagePrompt',
  input: {schema: AnalyzeCropDiseaseFromImageInputSchema},
  output: {schema: AnalyzeCropDiseaseFromImageOutputSchema},
  prompt: `You are an expert in plant pathology. A farmer has uploaded a photo of a crop, and your job is to analyze the photo and identify any potential diseases affecting the crop.

  Analyze the following image and provide a diagnosis.

  Photo: {{media url=photoDataUri}}

  Based on the image, determine if a disease is present. If so, identify the most likely disease, your confidence level (0-1), and suggested actions to take.
  If no disease is detected, indicate that no disease is present and leave the other fields blank.
  `,
});

const analyzeCropDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'analyzeCropDiseaseFromImageFlow',
    inputSchema: AnalyzeCropDiseaseFromImageInputSchema,
    outputSchema: AnalyzeCropDiseaseFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
