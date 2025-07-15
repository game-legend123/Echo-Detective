
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Trophy,
  TrendingUp,
  Fingerprint,
  Loader,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { realMessages } from "@/lib/real-messages";
import { generateFakeMessages } from "@/ai/flows/generate-fake-messages";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type GameState = "idle" | "loading" | "playing" | "answered" | "error";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const MessageCard = ({
  message,
  onSelect,
  disabled,
  isRevealed,
  isCorrect,
  isSelected,
}: {
  message: string;
  onSelect: (message: string) => void;
  disabled: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  isSelected: boolean;
}) => (
  <Card
    onClick={() => !disabled && onSelect(message)}
    className={cn(
      "p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105",
      !disabled && "cursor-pointer hover:border-primary/80",
      disabled && "cursor-not-allowed",
      isSelected && !isRevealed && "border-accent ring-2 ring-accent",
      isRevealed && isCorrect && "border-green-500 bg-green-500/10",
      isRevealed && isSelected && !isCorrect && "border-destructive bg-destructive/10",
      isRevealed && !isSelected && !isCorrect && "opacity-50",
      !isRevealed && disabled && !isSelected && "opacity-50"
    )}
  >
    <CardContent className="p-0 flex items-center gap-4">
      {isRevealed && (
        isCorrect ? <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" /> :
        isSelected ? <XCircle className="h-6 w-6 text-destructive shrink-0" /> : <div className="w-6 h-6 shrink-0"/>
      )}
      <p className="text-foreground/90">{message}</p>
    </CardContent>
  </Card>
);


export function GameClient() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [realMessage, setRealMessage] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [usedMessages, setUsedMessages] = useState<string[]>([]);
  const { toast } = useToast();

  const startNewRound = useCallback(async () => {
    setGameState("loading");
    setSelectedMessage(null);

    const availableMessages = realMessages.filter(m => !usedMessages.includes(m));
    if (availableMessages.length === 0) {
        // Reset if all messages are used
        setUsedMessages([]);
    }
    const currentRealMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)] || realMessages[0];
    
    setRealMessage(currentRealMessage);
    setUsedMessages(prev => [...prev, currentRealMessage]);

    try {
      const result = await generateFakeMessages({ realMessage: currentRealMessage });
      if (result.messages) {
        setMessages(shuffleArray(result.messages));
        setGameState("playing");
      } else {
        throw new Error("Failed to generate messages.");
      }
    } catch (error) {
      console.error(error);
      setGameState("error");
      toast({
        title: "Lỗi",
        description: "Không thể tạo tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [toast, usedMessages]);

  const handleSelectMessage = (message: string) => {
    if (gameState !== "playing") return;

    setSelectedMessage(message);
    setGameState("answered");

    if (message === realMessage) {
      const newScore = score + 500;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);
      toast({
        title: "Chính xác!",
        description: "+500 Điểm Sự Thật",
      });

      if (newCombo % 5 === 0 && newCombo > 0) {
        setScore(newScore + 3000);
        toast({
          title: `Combo ${newCombo}!`,
          description: "+3000 Điểm Vạch Trần",
          className: "bg-primary text-primary-foreground border-accent"
        });
      }
    } else {
      setScore(score - 300);
      setCombo(0);
      toast({
        title: "Sai rồi!",
        description: "-300 Điểm Nhẹ Dạ",
        variant: "destructive",
      });
    }
  };
  
  const GameBoard = useMemo(() => {
    if (gameState === 'loading' || (gameState === 'idle' && messages.length === 0)) {
       return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
        </div>
       );
    }
    return (
        <div className="grid grid-cols-1 gap-4 w-full animate-in fade-in duration-500">
            {messages.map((msg, index) => (
                <MessageCard
                    key={index}
                    message={msg}
                    onSelect={handleSelectMessage}
                    disabled={gameState !== 'playing'}
                    isRevealed={gameState === 'answered'}
                    isCorrect={msg === realMessage}
                    isSelected={msg === selectedMessage}
                />
            ))}
        </div>
    );
  }, [gameState, messages, handleSelectMessage, realMessage, selectedMessage]);


  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold flex items-center gap-3 justify-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
          <Fingerprint className="h-12 w-12" />
          Echo Detective
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Bạn có thể phân biệt được đâu là sự thật giữa một biển thông tin giả?</p>
      </header>

      <Card className="w-full p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="h-5 w-5" />
              <span className="text-sm">Điểm</span>
            </div>
            <p className="text-3xl font-bold">{score}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Combo</span>
            </div>
            <p className="text-3xl font-bold">{combo}</p>
          </div>
        </div>
      </Card>

      <main className="w-full flex flex-col items-center gap-6">
        {GameBoard}
        
        <div className="h-14">
            {(gameState === 'idle' || gameState === 'error') && (
                <Button onClick={startNewRound} size="lg" className="animate-in fade-in duration-500">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Bắt đầu
                </Button>
            )}
            {gameState === 'loading' && (
                <Button disabled size="lg">
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Đang tạo thử thách...
                </Button>
            )}
            {gameState === 'answered' && (
                <Button onClick={startNewRound} size="lg" className="animate-in fade-in duration-500">
                    Vòng tiếp theo
                </Button>
            )}
        </div>
      </main>
    </div>
  );
}
