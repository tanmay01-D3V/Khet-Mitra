
'use server';
/**
 * @fileOverview A flow for getting the weather forecast and crop recommendations for a location.
 *
 * - getWeatherForecast - A function that takes a location and returns the 7-day weather forecast and crop suggestions.
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
    cropRecommendations: z.array(z.string()).describe('A list of crops that are suitable to grow in the forecasted weather conditions for the given location.'),
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
    const weatherData = await getWeather(input);
    
    const prompt = ai.definePrompt({
      name: 'cropRecommendationForWeatherPrompt',
      input: { schema: z.object({ location: z.string(), weather: z.any() }) },
      output: { schema: GetWeatherForecastOutputSchema },
      prompt: `You are an agricultural expert. Based on the provided 7-day weather forecast for {{location}}, recommend a list of crops that would be suitable to plant or manage during this period.

Weather Forecast:
{{#each weather.forecast}}
- {{day}}: {{temperature}}, {{condition}}, Humidity: {{humidity}}
{{/each}}

Provide a list of suitable crops.
`,
    });

    const { output } = await prompt({ location: input.location, weather: weatherData });

    // Ensure the forecast from the tool is passed through, as the prompt output might not be reliable for structured data.
    return {
        forecast: weatherData.forecast,
        cropRecommendations: output!.cropRecommendations || []
    };
  }
);
