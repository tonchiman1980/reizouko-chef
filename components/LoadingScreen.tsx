
import React, { useState, useEffect } from 'react';
import { ChefHat, Loader2 } from 'lucide-react';

const messages = [
  "シェフが冷蔵庫をのぞいています...",
  "最高の組み合わせを考え中...",
  "おいしい魔法をかけています...",
  "旬の食材を見つけました！",
  "レシピを書き留めています..."
];

const LoadingScreen: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-emerald-50/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-orange-500 relative animate-bounce">
          <ChefHat size={48} />
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-xl font-bold text-emerald-900 animate-pulse">
          {messages[msgIdx]}
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-600/60 font-medium">
          <Loader2 className="animate-spin" size={20} />
          <span>しばらくお待ちください</span>
        </div>
      </div>

      <div className="absolute bottom-12 w-full max-w-xs px-12">
        <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-[loading_5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
