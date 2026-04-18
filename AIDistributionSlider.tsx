import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface SmartMoneyDialogProps {
  open: boolean;
  onClose: () => void;
  onDistribute: (distributions: { accountId: string; amount: number }[]) => void;
  accounts: { id: string; name: string; balance: number }[];
  spendingHistory: { [key: string]: number };
}

export function SmartMoneyDialog({ open, onClose, onDistribute, accounts, spendingHistory }: SmartMoneyDialogProps) {
  const [amount, setAmount] = useState("");
  const [distributions, setDistributions] = useState<{ [key: string]: number }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categoryAccounts = accounts.filter(acc => acc.id !== "main" && acc.id !== "savings");

  const calculateSmartDistribution = (totalAmount: number) => {
    setIsAnalyzing(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const totalSpending = Object.values(spendingHistory).reduce((sum, val) => sum + val, 0) || 1;
      const newDistributions: { [key: string]: number } = {};
      
      let remaining = totalAmount;
      
      // Calculate percentages based on spending patterns
      categoryAccounts.forEach((account, index) => {
        const spending = spendingHistory[account.id] || 0;
        let percentage = spending / totalSpending;
        
        // Add some intelligence: ensure minimum allocation if there was any spending
        if (spending > 0 && percentage < 0.1) {
          percentage = 0.1;
        }
        
        // Normalize to ensure we don't exceed 100%
        if (index === categoryAccounts.length - 1) {
          newDistributions[account.id] = Math.round(remaining * 100) / 100;
        } else {
          const allocation = Math.round(totalAmount * percentage * 100) / 100;
          newDistributions[account.id] = allocation;
          remaining -= allocation;
        }
      });
      
      setDistributions(newDistributions);
      setIsAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateSmartDistribution(parseFloat(amount));
    } else {
      setDistributions({});
    }
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distributionArray = Object.entries(distributions).map(([accountId, amt]) => ({
      accountId,
      amount: amt
    }));
    onDistribute(distributionArray);
    setAmount("");
    onClose();
  };

  const totalDistributed = Object.values(distributions).reduce((sum, val) => sum + val, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl backdrop-blur-2xl bg-gray-900/95 border-gray-700/50 rounded-3xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Умное распределение денег
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            AI автоматически распределит деньги на основе ваших трат
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium text-white">Сумма для распределения</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-2xl border-gray-700 bg-gray-800/50 text-white h-12 text-lg"
            />
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-purple-400" />
              </motion.div>
              <span className="ml-3 text-gray-400">AI анализирует ваши траты...</span>
            </div>
          )}

          {!isAnalyzing && Object.keys(distributions).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-lg text-white">Рекомендуемое распределение</h3>
              </div>
              
              {categoryAccounts.map((account) => {
                const distributedAmount = distributions[account.id] || 0;
                const percentage = totalDistributed > 0 
                  ? (distributedAmount / totalDistributed) * 100 
                  : 0;

                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{account.name}</span>
                      <span className="text-xl font-bold text-white">
                        {distributedAmount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {percentage.toFixed(1)}% от общей суммы
                    </p>
                  </motion.div>
                );
              })}

              <div className="mt-4 p-4 rounded-2xl bg-purple-900/30 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Итого распределено:</span>
                  <span className="text-2xl font-bold text-purple-100">
                    {totalDistributed.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 rounded-2xl h-12 font-semibold bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-2xl h-12 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={!amount || parseFloat(amount) <= 0 || totalDistributed === 0}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Распределить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
