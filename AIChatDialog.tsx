import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Smartphone, Zap, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface PhonePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onPayment: (accountId: string, amount: number, merchant: string, mccCode: string) => void;
}

// MCC code mapping to account categories
const MCC_CATEGORIES: { [key: string]: { category: string; accountId: string; name: string } } = {
  "5812": { category: "Кафе и рестораны", accountId: "coffee", name: "Кофе" },
  "5814": { category: "Фастфуд", accountId: "coffee", name: "Кофе" },
  "5411": { category: "Супермаркет", accountId: "supermarket", name: "Супермаркет" },
  "5422": { category: "Продукты", accountId: "supermarket", name: "Супермаркет" },
  "5941": { category: "Спорт и фитнес", accountId: "gym", name: "Тренировки" },
  "7997": { category: "Фитнес клуб", accountId: "gym", name: "Тренировки" },
  "5311": { category: "Магазины", accountId: "personal", name: "Личные покупки" },
  "5651": { category: "Одежда", accountId: "personal", name: "Личные покупки" },
};

export function PhonePaymentDialog({ open, onClose, onPayment }: PhonePaymentDialogProps) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [detectedAccount, setDetectedAccount] = useState<string | null>(null);
  const [mccCode, setMccCode] = useState<string>("");

  const simulateMCCDetection = (merchantName: string) => {
    const lower = merchantName.toLowerCase();
    
    let detectedMCC = "";
    
    if (lower.includes("кофе") || lower.includes("coffee") || lower.includes("starbucks")) {
      detectedMCC = "5812";
    } else if (lower.includes("фитнес") || lower.includes("gym") || lower.includes("спорт")) {
      detectedMCC = "7997";
    } else if (lower.includes("супермаркет") || lower.includes("магазин") || lower.includes("продукт")) {
      detectedMCC = "5411";
    } else if (lower.includes("одежда") || lower.includes("fashion") || lower.includes("обувь")) {
      detectedMCC = "5651";
    } else {
      detectedMCC = "5311"; // Default to personal
    }
    
    setMccCode(detectedMCC);
    const category = MCC_CATEGORIES[detectedMCC];
    setDetectedCategory(category.category);
    setDetectedAccount(category.accountId);
  };

  const handleMerchantChange = (value: string) => {
    setMerchant(value);
    if (value.length > 2) {
      simulateMCCDetection(value);
    } else {
      setDetectedCategory(null);
      setDetectedAccount(null);
      setMccCode("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (merchant && amountNum > 0 && detectedAccount) {
      onPayment(detectedAccount, amountNum, merchant, mccCode);
      setMerchant("");
      setAmount("");
      setDetectedCategory(null);
      setDetectedAccount(null);
      setMccCode("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-2xl bg-gray-900/95 border-gray-700/50 rounded-3xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-indigo-400" />
            Оплата телефоном
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            NFC оплата с автоматическим определением категории
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="merchant" className="text-base font-medium text-white">
              Название магазина
            </Label>
            <Input
              id="merchant"
              type="text"
              placeholder="Введите название..."
              value={merchant}
              onChange={(e) => handleMerchantChange(e.target.value)}
              className="rounded-2xl border-gray-700 bg-gray-800/50 text-white h-12 text-lg"
            />
          </div>

          {detectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30"
            >
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-indigo-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-indigo-200 mb-1">
                    AI определил категорию
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">{detectedCategory}</span> → списание с "{MCC_CATEGORIES[mccCode].name}"
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    MCC код: {mccCode}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {!detectedCategory && merchant.length > 0 && (
            <div className="p-4 rounded-2xl bg-yellow-900/20 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-200">
                    Введите больше информации о магазине для определения категории
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium text-white">
              Сумма платежа
            </Label>
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
              className="flex-1 rounded-2xl h-12 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={!merchant || !amount || parseFloat(amount) <= 0 || !detectedAccount}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Оплатить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
