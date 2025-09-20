
'use server';
/**
 * @fileOverview A tool for fetching weather forecasts.
 *
 * - getWeather - A Genkit tool that returns the weather forecast for a specific location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Returns the 7-day weather forecast for a given location in India.',
    inputSchema: z.object({
      location: z.string().describe('The city or region in India for which to get the weather forecast.'),
    }),
    outputSchema: z.object({
        forecast: z.array(z.object({
            day: z.string().describe('The day of the week.'),
            temperature: z.string().describe('The predicted temperature in Celsius.'),
            condition: z.string().describe('The predicted weather condition (e.g., Sunny, Cloudy, Rain).'),
            humidity: z.string().describe('The predicted humidity percentage.'),
        })),
    }),
  },
  async ({ location }) => {
    console.log(`Fetching weather for: ${location}`);
    // In a real application, you would call a weather API here.
    // For this example, we'll return a simulated forecast.
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const forecast = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const day = days[date.getDay()];
        const isRainy = location.toLowerCase().includes('mumbai') || location.toLowerCase().includes('satara');

        return {
            day,
            temperature: `${28 + Math.floor(Math.random() * 5)}°C`,
            condition: isRainy && i < 3 ? 'Light Rain' : 'Mostly Sunny',
            humidity: `${60 + Math.floor(Math.random() * 20)}%`
        };
    });

    return { forecast };
  }
);
