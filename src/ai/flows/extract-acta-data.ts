'use server';

/**
 * @fileOverview An AI agent to extract data from a voting act photo using OCR.
 *
 * - extractActaData - A function that handles the data extraction process.
 * - ExtractActaDataInput - The input type for the extractActaData function.
 * - ExtractActaDataOutput - The return type for the extractActaData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActaDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the voting act, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractActaDataInput = z.infer<typeof ExtractActaDataInputSchema>;

const ExtractActaDataOutputSchema = z.object({
  extractedData: z.string().describe('The extracted text data from the voting act photo.'),
});
export type ExtractActaDataOutput = z.infer<typeof ExtractActaDataOutputSchema>;

export async function extractActaData(input: ExtractActaDataInput): Promise<ExtractActaDataOutput> {
  return extractActaDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActaDataPrompt',
  input: {schema: ExtractActaDataInputSchema},
  output: {schema: ExtractActaDataOutputSchema},
  prompt: `You are an OCR expert. Extract all text from the following voting act photo:

Photo: {{media url=photoDataUri}}`,
});

const extractActaDataFlow = ai.defineFlow(
  {
    name: 'extractActaDataFlow',
    inputSchema: ExtractActaDataInputSchema,
    outputSchema: ExtractActaDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
