
import { GameClient } from '@/components/game/game-client';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <GameClient />
    </div>
  );
}
