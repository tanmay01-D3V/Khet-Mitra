
'use server';
/**
 * @fileOverview A friendly AI chatbot "Param-Mitr" to assist farmers.
 *
 * - paramMitrChat - A function that handles the chatbot conversation.
 * - ParamMitrChatInput - The input type for the paramMitrChat function.
 * - ParamMitrChatOutput - The return type for the paramMitrChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ParamMitrChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  language: z.enum(['en', 'hi']).describe('The language of the conversation.'),
});
export type ParamMitrChatInput = z.infer<typeof ParamMitrChatInputSchema>;

const ParamMitrChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type ParamMitrChatOutput = z.infer<typeof ParamMitrChatOutputSchema>;

export async function paramMitrChat(input: ParamMitrChatInput): Promise<ParamMitrChatOutput> {
  return paramMitrChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paramMitrChatPrompt',
  input: { schema: ParamMitrChatInputSchema },
  output: { schema: ParamMitrChatOutputSchema },
  prompt: `You are Param-Mitr, a friendly and knowledgeable AI assistant for farmers in India. Your goal is to help them with their farming questions.

You must respond in the user's specified language: {{language}}.

You are an expert in Indian agriculture, including crop management, soil health, pest control, and market prices. You can understand and respond to queries in both standard language and common dialects, including Hinglish.

User's message: {{{message}}}

Provide a clear, concise, and helpful response. If the user's language is 'hi', respond in Hindi. Otherwise, respond in English.
`,
});

const paramMitrChatFlow = ai.defineFlow(
  {
    name: 'paramMitrChatFlow',
    inputSchema: ParamMitrChatInputSchema,
    outputSchema: ParamMitrChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
