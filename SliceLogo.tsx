import { ArrowUpRight, ArrowDownLeft, QrCode } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { GlassCard } from "./GlassCard";
import { motion, AnimatePresence } from "motion/react";

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: Date;
  type: "transfer" | "expense" | "sbp";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  accounts: { id: string; name: string; nameEn?: string }[];
}

const springConfig = {
  type: "spring" as const,
  stiffness: 350,
  damping: 28,
};

export function TransactionHistory({ transactions, accounts }: TransactionHistoryProps) {
  const getAccountName = (id: string) => {
    return accounts.find(acc => acc.id === id)?.name || id;
  };

  return (
    <GlassCard className="p-8" variant="secondary">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">История операций</h2>
      <ScrollArea className="h-[400px] pr-4">
        {transactions.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 dark:text-gray-400 text-center py-8"
          >
            Нет операций
          </motion.p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {transactions.map((transaction, index) => (
                <motion.div 
                  key={transaction.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ ...springConfig, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-5 backdrop-blur-md bg-white/50 dark:bg-gray-700/30 rounded-2xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-300 border border-gray-200 dark:border-gray-600/30 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className={`p-3 rounded-xl ${
                        transaction.type === 'sbp' ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 
                        transaction.type === 'transfer' ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/30 text-blue-600 dark:text-blue-400' : 'bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/30 text-purple-600 dark:text-purple-400'
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {transaction.type === 'sbp' ? (
                        <QrCode className="h-5 w-5" />
                      ) : transaction.type === 'transfer' ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5" />
                      )}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {getAccountName(transaction.from)} → {getAccountName(transaction.to)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.date.toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
                    {transaction.amount.toLocaleString('ru-RU')} ₽
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </GlassCard>
  );
}