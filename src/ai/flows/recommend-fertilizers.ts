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
  cropType: z.string().describe('The type of crop being grown.'),
  soilReportDataUri: z
    .string()
    .describe(
      "The soil test results, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  region: z.string().describe('The region where the farm is located.'),
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
  prompt: `You are an expert agricultural advisor. Based on the crop type, soil report, and region, provide specific fertilizer recommendations to optimize plant health and yield.

Crop Type: {{{cropType}}}
Soil Report: {{media url=soilReportDataUri}}
Region: {{{region}}}

Provide detailed recommendations, including types of fertilizers, application methods, and timing.`,
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
