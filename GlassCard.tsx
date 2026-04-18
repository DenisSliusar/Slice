import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (fromAccount: string, toAccount: string, amount: number) => void;
  accounts: { id: string; name: string; balance: number }[];
  selectedAccount?: string;
}

export function TransferDialog({ open, onClose, onTransfer, accounts, selectedAccount }: TransferDialogProps) {
  const [fromAccount, setFromAccount] = useState(selectedAccount || "main");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (fromAccount && toAccount && amountNum > 0) {
      onTransfer(fromAccount, toAccount, amountNum);
      setAmount("");
      setToAccount("");
      onClose();
    }
  };

  const availableBalance = accounts.find(acc => acc.id === fromAccount)?.balance || 0;
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccount);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-2xl bg-white/90 border-white/50 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Перевод между счетами</DialogTitle>
          <DialogDescription>
            Переведите средства между вашими счетами
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="from" className="text-base font-medium">Откуда</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger id="from" className="rounded-2xl border-gray-200 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {accounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id} className="rounded-xl">
                    {acc.name} ({acc.balance.toLocaleString('ru-RU')} ₽)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to" className="text-base font-medium">Куда</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger id="to" className="rounded-2xl border-gray-200 h-12">
                <SelectValue placeholder="Выберите счёт" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {availableToAccounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id} className="rounded-xl">
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium">Сумма</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={availableBalance}
              className="rounded-2xl border-gray-200 h-12 text-lg"
            />
            <p className="text-sm text-gray-500 font-medium">
              Доступно: {availableBalance.toLocaleString('ru-RU')} ₽
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-semibold">
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-2xl h-12 font-semibold bg-black hover:bg-gray-800"
              disabled={!toAccount || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
            >
              Перевести
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}