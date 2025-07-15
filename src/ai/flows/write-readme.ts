'use server';
/**
 * @fileOverview Generates a comprehensive README file in Vietnamese for the game, including game overview, key features,
 * installation guide, gameplay instructions, contact information, and a call to action. It uses a Genkit flow to interact
 * with a language model that writes the README content in clear Vietnamese.
 *
 * - writeReadme - A function that generates the README content.
 * - WriteReadmeInput - The input type for the writeReadme function.
 * - WriteReadmeOutput - The return type for the writeReadme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WriteReadmeInputSchema = z.object({
  gameName: z.string().describe('The name of the game.'),
  gameDescription: z.string().describe('A brief description of the game.'),
  coreFeatures: z.array(z.string()).describe('A list of core features of the game.'),
});
export type WriteReadmeInput = z.infer<typeof WriteReadmeInputSchema>;

const WriteReadmeOutputSchema = z.object({
  readmeContent: z.string().describe('The complete content of the README.md file in Vietnamese.'),
});
export type WriteReadmeOutput = z.infer<typeof WriteReadmeOutputSchema>;

export async function writeReadme(input: WriteReadmeInput): Promise<WriteReadmeOutput> {
  return writeReadmeFlow(input);
}

const writeReadmePrompt = ai.definePrompt({
  name: 'writeReadmePrompt',
  input: {schema: WriteReadmeInputSchema},
  output: {schema: WriteReadmeOutputSchema},
  prompt: `Bạn là một chuyên gia viết tài liệu game, có khả năng viết README.md hoàn chỉnh và hấp dẫn bằng tiếng Việt.

  Dựa trên thông tin sau về trò chơi, hãy viết một file README.md đầy đủ, bao gồm:

  - Tiêu đề nổi bật và badge trạng thái (ví dụ: 🚀 Mới ra mắt | ⭐ Đang thịnh hành)
  - Giới thiệu tổng quan ngắn gọn, ấn tượng
  - Danh sách tính năng chính dễ đọc
  - Hướng dẫn cài đặt / tải game, gồm:
  - Yêu cầu hệ thống tối thiểu và khuyến nghị
  - Các bước cài đặt chi tiết cho từng nền tảng
  - Link tải game
  - Hướng dẫn cách chơi, từng bước cơ bản
  - Ghi chú vị trí chèn hình ảnh / GIF demo gameplay
  - Thông tin liên hệ và kênh cộng đồng (Discord, Website, Email)
  - Lời kêu gọi hành động mạnh mẽ, khuyến khích tải và trải nghiệm ngay

  Sử dụng tiếng Việt chuẩn, bố cục gọn gàng, có emoji, dễ đọc.

  Thông tin trò chơi:
  - Tên game: {{{gameName}}}
  - Mô tả: {{{gameDescription}}}
  - Tính năng chính:
  {{#each coreFeatures}}
  - {{{this}}}
  {{/each}}
  `,
});

const writeReadmeFlow = ai.defineFlow(
  {
    name: 'writeReadmeFlow',
    inputSchema: WriteReadmeInputSchema,
    outputSchema: WriteReadmeOutputSchema,
  },
  async input => {
    const {output} = await writeReadmePrompt(input);
    return output!;
  }
);
