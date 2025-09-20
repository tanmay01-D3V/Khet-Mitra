
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
  prompt: `You are an expert agricultural advisor. Analyze the provided soil report image to identify the crop type and the region. Based on this extracted information and the soil analysis data in the report, provide specific fertilizer recommendations to optimize plant health and yield.

Soil Report: {{media url=soilReportDataUri}}

First, extract the crop type and region from the document.
Then, provide detailed recommendations, including types of fertilizers, application methods, and timing.`,
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
