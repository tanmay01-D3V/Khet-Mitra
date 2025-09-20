'use server';
/**
 * @fileOverview A flow for converting geographic coordinates to a human-readable address.
 *
 * - getAddressFromCoordinates - A function that takes latitude and longitude and returns an address.
 * - GetAddressFromCoordinatesInput - The input type for the getAddressFromCoordinates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAddressFromCoordinates as getAddressFromCoordinatesTool } from '@/ai/tools/reverse-geocoding';

const GetAddressFromCoordinatesInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetAddressFromCoordinatesInput = z.infer<typeof GetAddressFromCoordinatesInputSchema>;

export async function getAddressFromCoordinates(
  input: GetAddressFromCoordinatesInput
): Promise<string> {
    return getAddressFromCoordinatesFlow(input);
}


const getAddressFromCoordinatesFlow = ai.defineFlow(
  {
    name: 'getAddressFromCoordinatesFlow',
    inputSchema: GetAddressFromCoordinatesInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    return await getAddressFromCoordinatesTool(input);
  }
);
