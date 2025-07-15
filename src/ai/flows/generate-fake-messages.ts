// use server'

/**
 * @fileOverview Flow to generate a list of fake messages and one real message.
 *
 * - generateFakeMessages - A function that generates a list of fake messages and one real message.
 * - GenerateFakeMessagesInput - The input type for the generateFakeMessages function.
 * - GenerateFakeMessagesOutput - The return type for the generateFakeMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFakeMessagesInputSchema = z.object({
  realMessage: z.string().describe('The real message to be included in the list.'),
});
export type GenerateFakeMessagesInput = z.infer<typeof GenerateFakeMessagesInputSchema>;

const GenerateFakeMessagesOutputSchema = z.object({
  messages: z.array(z.string()).describe('An array containing four fake messages and one real message.'),
});
export type GenerateFakeMessagesOutput = z.infer<typeof GenerateFakeMessagesOutputSchema>;

export async function generateFakeMessages(input: GenerateFakeMessagesInput): Promise<GenerateFakeMessagesOutput> {
  return generateFakeMessagesFlow(input);
}

const generateFakeMessagesPrompt = ai.definePrompt({
  name: 'generateFakeMessagesPrompt',
  input: {schema: GenerateFakeMessagesInputSchema},
  output: {schema: GenerateFakeMessagesOutputSchema},
  prompt: `You are an AI game master, adept at creating believable fake messages.

  Given a real message, your task is to create four fake messages that are similar in style and tone but are entirely fabricated. Return the messages as a list.
  The real message must also be included in the list of fake messages. The real message should not be identified within the list.  
  Real Message: {{{realMessage}}}
  `,
});

const generateFakeMessagesFlow = ai.defineFlow(
  {
    name: 'generateFakeMessagesFlow',
    inputSchema: GenerateFakeMessagesInputSchema,
    outputSchema: GenerateFakeMessagesOutputSchema,
  },
  async input => {
    const {output} = await generateFakeMessagesPrompt(input);
    return output!;
  }
);
