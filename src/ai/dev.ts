
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-fertilizers.ts';
import '@/ai/flows/recommend-crops-based-on-soil-analysis.ts';
import '@/ai/flows/analyze-crop-disease-from-image.ts';
import '@/ai/flows/get-address-from-coordinates-flow.ts';
import '@/ai/flows/extract-aadhar-info-flow.ts';
import '@/ai/flows/param-mitr-chat-flow.ts';
import '@/ai/tools/weather-tool.ts';
