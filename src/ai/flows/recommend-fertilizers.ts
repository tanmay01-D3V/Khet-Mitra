
'use server';

/**
 * @fileOverview Provides fertilizer and insecticide recommendations tailored to the crop and soil conditions.
 *
 * - recommendFertilizersAndInsecticides - A function that provides fertilizer and insecticide recommendations.
 * - RecommendFertilizersAndInsecticidesInput - The input type for the recommendFertilizersAndInsecticides function.
 * - RecommendFertilizersAndInsecticidesOutput - The return type for the recommendFertilizersAndInsecticides function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFertilizersAndInsecticidesInputSchema = z.object({
  cropType: z.string().optional().describe('The type of crop being grown.'),
  region: z.string().optional().describe('The geographical region of the farm.'),
  soilReportDataUri: z
    .string()
    .describe(
      "The soil test results, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecommendFertilizersAndInsecticidesInput = z.infer<typeof RecommendFertilizersAndInsecticidesInputSchema>;

const RecommendFertilizersAndInsecticidesOutputSchema = z.object({
  fertilizerRecommendations: z
    .string()
    .describe('Specific fertilizer recommendations for the given crop and soil conditions.'),
  insecticideRecommendations: z
    .string()
    .describe('Specific insecticide recommendations based on any identified diseases or common pests for the crop and region.'),
});
export type RecommendFertilizersAndInsecticidesOutput = z.infer<typeof RecommendFertilizersAndInsecticidesOutputSchema>;

export async function recommendFertilizersAndInsecticides(input: RecommendFertilizersAndInsecticidesInput): Promise<RecommendFertilizersAndInsecticidesOutput> {
  return recommendFertilizersAndInsecticidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFertilizersAndInsecticidesPrompt',
  input: {schema: RecommendFertilizersAndInsecticidesInputSchema},
  output: {schema: RecommendFertilizersAndInsecticidesOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the provided soil report image and other details to provide specific fertilizer and insecticide recommendations.

Soil Report: {{media url=soilReportDataUri}}
{{#if cropType}}
Crop Type: {{{cropType}}}
{{/if}}
{{#if region}}
Region: {{{region}}}
{{/if}}

Your primary goal is to provide both fertilizer and insecticide recommendations.
- If the user provides a Crop Type and/or Region, use that information to tailor your advice.
- If the user does NOT provide a Crop Type or Region, you MUST first extract the crop type and region from the soil report document.
- After determining the crop and region, analyze the soil data in the report.
- Provide detailed fertilizer recommendations, including types, application methods, and timing.
- Additionally, analyze the report for any signs of crop disease or infer common pests for the specified crop and region. Based on this, provide detailed insecticide recommendations, including product names, application methods, and timing.`,
});

const recommendFertilizersAndInsecticidesFlow = ai.defineFlow(
  {
    name: 'recommendFertilizersAndInsecticidesFlow',
    inputSchema: RecommendFertilizersAndInsecticidesInputSchema,
    outputSchema: RecommendFertilizersAndInsecticidesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
