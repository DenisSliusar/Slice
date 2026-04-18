import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface AddMoneyDialogProps {
  open: boolean;
  onClose: () => void;
  onAddMoney: (amount: number, distribute: boolean) => void;
}

export function AddMoneyDialog({
  open,
  onClose,
  onAddMoney,
}: AddMoneyDialogProps) {
  const [amount, setAmount] = useState("");
  const [distribute, setDistribute] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      onAddMoney(amountNum, distribute);
      setAmount("");
      setDistribute(false);
      onClose();
    }
  };

  const quickAmounts = [1000, 5000, 10000, 20000];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border-white/50 dark:border-gray-700/50 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Plus className="h-6 w-6 text-green-600" />
            Пополнить основной счёт
          </DialogTitle>
          <DialogDescription>
            Добавьте средства на ваш основной счёт
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-4"
        >
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-base font-medium"
            >
              Сумма пополнения
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-2xl border-gray-200 dark:border-gray-700 h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">
              Быстрая сумма
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <motion.div
                  key={quickAmount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAmount(quickAmount.toString())
                    }
                    className="text-sm rounded-xl h-10 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                  >
                    {quickAmount.toLocaleString("ru-RU")}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
            <div>
              <Label htmlFor="distribute" className="font-semibold cursor-pointer">
                AI Распределение
              </Label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Автоматически распределить по категориям
              </p>
            </div>
            <Switch
              id="distribute"
              checked={distribute}
              onCheckedChange={setDistribute}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl h-12 font-semibold"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Пополнить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}