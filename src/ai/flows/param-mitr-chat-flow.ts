
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
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

const ParamMitrChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  language: z.enum(['en', 'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'or', 'ml', 'pa', 'as']).describe('The language of the conversation.'),
});
export type ParamMitrChatInput = z.infer<typeof ParamMitrChatInputSchema>;

const ParamMitrChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
  audioDataUri: z.string().describe('The chatbot\'s response as a data URI for the audio.'),
});
export type ParamMitrChatOutput = z.infer<typeof ParamMitrChatOutputSchema>;

export async function paramMitrChat(input: ParamMitrChatInput): Promise<ParamMitrChatOutput> {
  return paramMitrChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paramMitrChatPrompt',
  input: { schema: z.object({ message: z.string(), language: z.string() }) },
  output: { schema: z.object({ response: z.string() }) },
  prompt: `You are Param-Mitr, a friendly and knowledgeable AI assistant for farmers in India. Your goal is to help them with their farming questions.

You are an expert in Indian agriculture, including crop management, soil health, pest control, and market prices.

Your primary language for response is determined by the user's input.
- If the user's message is in Hindi or Hinglish, you MUST respond in clear, standard Hindi with a natural, conversational accent.
- If the user's message is in English, respond in English.
- For any other language specified in the 'language' input, try to respond in that language if you are capable.

User's message: {{{message}}}
User's preferred language setting: {{language}}

Provide a clear, concise, and helpful response based on these rules.
`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const paramMitrChatFlow = ai.defineFlow(
  {
    name: 'paramMitrChatFlow',
    inputSchema: ParamMitrChatInputSchema,
    outputSchema: ParamMitrChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    const textResponse = output!.response;

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: textResponse,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      response: textResponse,
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
