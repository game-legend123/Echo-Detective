'use server';
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
  messages: z.array(z.string()).describe('An array containing four fake messages and the one real message, in a random order.'),
});
export type GenerateFakeMessagesOutput = z.infer<typeof GenerateFakeMessagesOutputSchema>;

export async function generateFakeMessages(input: GenerateFakeMessagesInput): Promise<GenerateFakeMessagesOutput> {
  return generateFakeMessagesFlow(input);
}

const generateFakeMessagesPrompt = ai.definePrompt({
  name: 'generateFakeMessagesPrompt',
  input: {schema: GenerateFakeMessagesInputSchema},
  output: {schema: GenerateFakeMessagesOutputSchema},
  prompt: `You are an AI game master, adept at creating believable fake messages in Vietnamese.

  Given a real Vietnamese message, your task is to create four fake Vietnamese messages that are similar in style, tone, and topic, but are entirely fabricated.
  The goal is to make the fake messages plausible enough to trick a human player.
  
  Return a list of 5 messages in total: the 4 fake messages you created and the original real message.
  The order of messages in the returned array should be random.
  
  Real Message (in Vietnamese): {{{realMessage}}}
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
