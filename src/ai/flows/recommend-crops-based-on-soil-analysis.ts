'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending crops based on soil analysis and location.
 *
 * - recommendCropsBasedOnSoilAnalysis - A function that takes soil analysis data and returns crop recommendations.
 * - RecommendCropsBasedOnSoilAnalysisInput - The input type for the recommendCropsBasedOnSoilAnalysis function.
 * - RecommendCropsBasedOnSoilAnalysisOutput - The return type for the recommendCropsBasedOnSoilAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCropsBasedOnSoilAnalysisInputSchema = z.object({
  soilTestResults: z.string().describe('The laboratory test results of the soil, including pH, nitrogen, phosphorus, potassium, and micronutrient levels.'),
  location: z.string().describe('The geographical location of the farm (can be coordinates).'),
});
export type RecommendCropsBasedOnSoilAnalysisInput = z.infer<typeof RecommendCropsBasedOnSoilAnalysisInputSchema>;

const RecommendCropsBasedOnSoilAnalysisOutputSchema = z.object({
  recommendedCrops: z.array(z.string()).describe('A list of recommended crops suitable for the given soil conditions, location, and climate.'),
  soilInfo: z.string().describe('A summary of the soil analysis results, highlighting key characteristics and deficiencies.'),
});
export type RecommendCropsBasedOnSoilAnalysisOutput = z.infer<typeof RecommendCropsBasedOnSoilAnalysisOutputSchema>;

export async function recommendCropsBasedOnSoilAnalysis(
  input: RecommendCropsBasedOnSoilAnalysisInput
): Promise<RecommendCropsBasedOnSoilAnalysisOutput> {
  return recommendCropsBasedOnSoilAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCropsBasedOnSoilAnalysisPrompt',
  input: {schema: RecommendCropsBasedOnSoilAnalysisInputSchema},
  output: {schema: RecommendCropsBasedOnSoilAnalysisOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the soil test results and location provided, identify the local climatic conditions and recommend the most suitable crops to grow.

  Soil Test Results: {{{soilTestResults}}}
  Location: {{{location}}}

  Infer the climatic conditions (like temperature, rainfall, and sunlight hours) from the location.
  Consider all factors, including soil pH, nutrient levels, and the inferred climate when making your recommendations.

  Provide a list of recommended crops and a summary of the soil analysis results.
  Format the response as a JSON object.
  `,
});

const recommendCropsBasedOnSoilAnalysisFlow = ai.defineFlow(
  {
    name: 'recommendCropsBasedOnSoilAnalysisFlow',
    inputSchema: RecommendCropsBasedOnSoilAnalysisInputSchema,
    outputSchema: RecommendCropsBasedOnSoilAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
