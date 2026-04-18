import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { Lightbulb } from "lucide-react";

interface DailyAdviceProps {
  accounts: { id: string; name: string; balance: number }[];
  spendingHistory: { [key: string]: number };
}

export function DailyAdvice({ accounts, spendingHistory }: DailyAdviceProps) {
  // Generate simple advice based on spending
  const totalSpending = Object.values(spendingHistory).reduce((a, b) => a + b, 0);
  const avgSpending = totalSpending / Object.keys(spendingHistory).length;
  
  const getAdvice = () => {
    const coffeeSpending = spendingHistory.coffee || 0;
    const gymSpending = spendingHistory.gym || 0;
    
    if (coffeeSpending > 8000) {
      return {
        title: "Совет дня: Кофе",
        text: "Вы потратили много на кофе. Попробуйте готовить кофе дома — сэкономите до 70%!",
        emoji: "☕"
      };
    }
    
    if (gymSpending > 10000) {
      return {
        title: "Совет дня: Тренировки",
        text: "Отличная работа! Вы инвестируете в своё здоровье. Продолжайте в том же духе!",
        emoji: "💪"
      };
    }
    
    return {
      title: "Совет дня",
      text: "Отличный баланс расходов! Рассмотрите возможность увеличения накоплений на 5%.",
      emoji: "💡"
    };
  };

  const advice = getAdvice();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
    >
      <GlassCard className="p-6" variant="secondary">
        <div className="flex items-start gap-4">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Lightbulb className="h-6 w-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {advice.emoji} {advice.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {advice.text}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
