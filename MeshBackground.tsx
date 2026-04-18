import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AccountCardProps {
  name: string;
  balance: number;
  icon: React.ReactNode;
  onTransfer: () => void;
  onClick?: () => void;
  budget?: number;
  color: string;
}

const springConfig = {
  type: "spring" as const,
  stiffness: 350,
  damping: 28,
};

export function AccountCard({ name, balance, icon, onTransfer, onClick, budget = 10000, color }: AccountCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progress = Math.min((balance / budget) * 100, 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ${
        isHovered ? 'bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700' : 'backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 shadow-xl border border-white/50 dark:border-gray-700/50'
      }`}
      style={{
        boxShadow: isHovered 
          ? '0 20px 60px 0 rgba(99, 102, 241, 0.25)' 
          : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, currentColor 0%, transparent 100%)`,
        }}
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={`p-4 rounded-2xl transition-all duration-500 ${
              isHovered ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : 'bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/60 dark:to-gray-600/40'
            }`}
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className={color}>
              {icon}
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTransfer();
              }}
              className={`rounded-full transition-all duration-300 ${
                isHovered 
                  ? 'hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700' 
                  : 'hover:bg-white/20 dark:hover:bg-gray-700/20 border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-gray-100'
              }`}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <div className="space-y-3">
          <h3 className={`font-medium text-sm transition-colors duration-300 text-gray-600 dark:text-gray-400`}>
            {name}
          </h3>
          <p className={`text-3xl font-bold transition-colors duration-300 text-gray-900 dark:text-gray-100`}>
            {balance.toLocaleString('ru-RU')} ₽
          </p>

          {/* Progress bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Spent
              </span>
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700/60`}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isHovered 
                    ? 'linear-gradient(90deg, rgba(99,102,241,0.9) 0%, rgba(139,92,246,0.7) 100%)'
                    : 'linear-gradient(90deg, rgba(99,102,241,0.7) 0%, rgba(139,92,246,0.5) 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
            <p className={`text-xs text-gray-600 dark:text-gray-400`}>
              Budget: {budget.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      </div>

      {/* Glass reflection effect */}
      <div className={`absolute top-0 left-0 right-0 h-1/2 ${
        isHovered ? 'bg-gradient-to-b from-white/20 to-transparent' : 'bg-gradient-to-b from-white/10 to-transparent'
      } pointer-events-none rounded-t-3xl`} />
    </motion.div>
  );
}