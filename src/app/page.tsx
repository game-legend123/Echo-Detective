
import { GameClient } from '@/components/game/game-client';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <GameClient />
    </div>
  );
}
