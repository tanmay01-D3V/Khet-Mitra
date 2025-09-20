
'use server';
/**
 * @fileOverview A flow for getting the weather forecast for a location.
 *
 * - getWeatherForecast - A function that takes a location and returns the 7-day weather forecast.
 * - GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * - GetWeatherForecastOutput - The output type for the getWeatherForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getWeather } from '@/ai/tools/weather-tool';

const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The city or region in India for which to get the weather forecast.'),
});
export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const GetWeatherForecastOutputSchema = z.object({
    forecast: z.array(z.object({
        day: z.string().describe('The day of the week.'),
        temperature: z.string().describe('The predicted temperature in Celsius.'),
        condition: z.string().describe('The predicted weather condition (e.g., Sunny, Cloudy, Rain).'),
        humidity: z.string().describe('The predicted humidity percentage.'),
    })),
});
export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;


export async function getWeatherForecast(
  input: GetWeatherForecastInput
): Promise<GetWeatherForecastOutput> {
    return getWeatherForecastFlow(input);
}


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    return await getWeather(input);
  }
);
