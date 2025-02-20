import { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { EmotiReel } from "@/components/game/EmotiReel";
import { SpinButton } from "@/components/game/SpinButton";
import { getRandomEmoji, checkWin } from "@/lib/game";
import { useToast } from "@/hooks/use-toast";

export default function SlotMachine() {
  const [reels, setReels] = useState(["❓", "❓", "❓"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasSpunOnce, setHasSpunOnce] = useState(false);
  const { toast } = useToast();

  const spin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    if (!hasSpunOnce) setHasSpunOnce(true);

    setTimeout(() => {
      const newReels = [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()];
      setReels(newReels);
      setIsSpinning(false);

      const winAmount = checkWin(newReels);
      if (winAmount > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);

        toast({
          title: "Winner!",
          description: `You won ${winAmount} points!`,
        });
      }
    }, 1500);
  };

  const hasMatch = !isSpinning && reels[0] === reels[1] && reels[1] === reels[2] && hasSpunOnce;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-4xl font-semibold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Emoji Slots
        </h1>

        <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl">
          <div className="flex justify-center gap-4 mb-8">
            {reels.map((emoji, i) => (
              <EmotiReel 
                key={i} 
                emoji={emoji} 
                isSpinning={isSpinning} 
                hasMatch={hasMatch}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <SpinButton onClick={spin} disabled={isSpinning} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}