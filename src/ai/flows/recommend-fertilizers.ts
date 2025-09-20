
'use server';

/**
 * @fileOverview Provides fertilizer recommendations tailored to the crop and soil conditions.
 *
 * - recommendFertilizers - A function that provides fertilizer recommendations.
 * - RecommendFertilizersInput - The input type for the recommendFertilizers function.
 * - RecommendFertilizersOutput - The return type for the recommendFertilizers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFertilizersInputSchema = z.object({
  cropType: z.string().optional().describe('The type of crop being grown.'),
  region: z.string().optional().describe('The geographical region of the farm.'),
  soilReportDataUri: z
    .string()
    .describe(
      "The soil test results, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecommendFertilizersInput = z.infer<typeof RecommendFertilizersInputSchema>;

const RecommendFertilizersOutputSchema = z.object({
  fertilizerRecommendations: z
    .string()
    .describe('Specific fertilizer recommendations for the given crop and soil conditions.'),
});
export type RecommendFertilizersOutput = z.infer<typeof RecommendFertilizersOutputSchema>;

export async function recommendFertilizers(input: RecommendFertilizersInput): Promise<RecommendFertilizersOutput> {
  return recommendFertilizersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFertilizersPrompt',
  input: {schema: RecommendFertilizersInputSchema},
  output: {schema: RecommendFertilizersOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the provided soil report image and other details to provide specific fertilizer recommendations.

Soil Report: {{media url=soilReportDataUri}}
{{#if cropType}}
Crop Type: {{{cropType}}}
{{/if}}
{{#if region}}
Region: {{{region}}}
{{/if}}

Your primary goal is to provide fertilizer recommendations based on the soil analysis.
- If the user provides a Crop Type and/or Region, use that information to tailor your advice.
- If the user does NOT provide a Crop Type or Region, you MUST first extract the crop type and region from the soil report document.
- After determining the crop and region (either from the input or the document), analyze the soil data in the report.
- Provide detailed recommendations, including types of fertilizers, application methods, and timing to optimize plant health and yield.`,
});

const recommendFertilizersFlow = ai.defineFlow(
  {
    name: 'recommendFertilizersFlow',
    inputSchema: RecommendFertilizersInputSchema,
    outputSchema: RecommendFertilizersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
