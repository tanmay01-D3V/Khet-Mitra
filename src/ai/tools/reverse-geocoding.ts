'use server';
/**
 * @fileOverview A tool for converting geographic coordinates to a human-readable address.
 *
 * - getAddressFromCoordinates - A function that takes latitude and longitude and returns an address.
 * - GetAddressFromCoordinatesInput - The input type for the getAddressFromCoordinates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GetAddressFromCoordinatesInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetAddressFromCoordinatesInput = z.infer<typeof GetAddressFromCoordinatesInputSchema>;

export const getAddressFromCoordinatesTool = ai.defineTool(
  {
    name: 'getAddressFromCoordinates',
    description: 'Returns a human-readable address from geographic coordinates.',
    inputSchema: GetAddressFromCoordinatesInputSchema,
    outputSchema: z.string(),
  },
  async ({ latitude, longitude }) => {
    try {
      // In a real application, you would use a geocoding service API.
      // For this example, we'll simulate it.
      if (latitude === 17.68 && longitude === 74.01) {
        return 'Satara, Maharashtra, India';
      }
      if (latitude > 17 && latitude < 18 && longitude > 73 && longitude < 75) {
        return 'Karad, Maharashtra, India';
      }
      return 'An address in the specified region';
    } catch (error) {
      console.error('Error fetching address:', error);
      throw new Error('Could not retrieve address from coordinates.');
    }
  }
);

export async function getAddressFromCoordinates(
  input: GetAddressFromCoordinatesInput
): Promise<string> {
  return getAddressFromCoordinatesTool(input);
}
