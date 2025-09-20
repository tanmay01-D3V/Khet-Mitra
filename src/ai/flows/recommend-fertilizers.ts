
'use server';

/**
 * @fileOverview Provides fertilizer and insecticide recommendations tailored to the crop and soil conditions.
 *
 * - recommendFertilizersAndInsecticides - A function that provides fertilizer and insecticide recommendations.
 * - RecommendFertilizersAndInsecticidesInput - The input type for the recommendFertilizersAndInsecticidesInput function.
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

const RecommendationSchema = z.object({
    name: z.string().describe('The name of the recommended product.'),
    description: z.string().describe('A two-line description of why and how to use the product.'),
    emoji: z.string().describe('A single emoji character related to the product or its purpose.'),
});

const RecommendFertilizersAndInsecticidesOutputSchema = z.object({
  fertilizerRecommendations: z
    .array(RecommendationSchema)
    .describe('A list of specific fertilizer recommendations for the given crop and soil conditions.'),
  insecticideRecommendations: z
    .array(RecommendationSchema)
    .describe('A list of specific insecticide recommendations based on any identified diseases or common pests for the crop and region.'),
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

Your primary goal is to provide a list of both fertilizer and insecticide recommendations.
- If the user provides a Crop Type and/or Region, use that information to tailor your advice.
- If the user does NOT provide a Crop Type or Region, you MUST first extract the crop type and region from the soil report document.
- After determining the crop and region, analyze the soil data in the report.
- For each recommendation, provide the product name, a concise two-line description of its benefits and application, and a relevant emoji.
- For fertilizer recommendations, suggest products to balance soil nutrients.
- For insecticide recommendations, analyze the report for any signs of crop disease or infer common pests for the specified crop and region, then suggest appropriate products.
`,
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
