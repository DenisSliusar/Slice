import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { PieChart, Coffee, Dumbbell, ShoppingCart, User } from "lucide-react";

interface SpendingWheelProps {
  accounts: { id: string; name: string; balance: number }[];
  spendingHistory: { [key: string]: number };
  onSegmentClick?: (accountId: string) => void;
}

export function SpendingWheel({ accounts, spendingHistory, onSegmentClick }: SpendingWheelProps) {
  const total = Object.values(spendingHistory).reduce((sum, val) => sum + val, 0);
  
  const categoryData = [
    { id: "personal", name: "Личные", amount: spendingHistory.personal || 0, color: "#a855f7", icon: User },
    { id: "coffee", name: "Кофе", amount: spendingHistory.coffee || 0, color: "#f59e0b", icon: Coffee },
    { id: "gym", name: "Спорт", amount: spendingHistory.gym || 0, color: "#10b981", icon: Dumbbell },
    { id: "supermarket", name: "Продукты", amount: spendingHistory.supermarket || 0, color: "#3b82f6", icon: ShoppingCart },
  ];

  return (
    <GlassCard className="p-6" variant="secondary">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        Распределение расходов
      </h3>
      
      <div className="space-y-3">
        {categoryData.map((category) => {
          const percentage = total > 0 ? (category.amount / total) * 100 : 0;
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSegmentClick?.(category.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: category.color }} />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {category.amount.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
