import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Scan } from "lucide-react";

interface QRPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onPayment: (fromAccount: string, amount: number, recipient: string) => void;
  accounts: { id: string; name: string; balance: number }[];
}

export function QRPaymentDialog({ open, onClose, onPayment, accounts }: QRPaymentDialogProps) {
  const [activeTab, setActiveTab] = useState("show");
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("main");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scannedData, setScannedData] = useState("");

  const handleGenerateQR = () => {
    if (amount && parseFloat(amount) > 0) {
      const qrData = JSON.stringify({
        type: "sbp",
        recipient: "LOMO Bank",
        phone: "+7 (900) 123-45-67",
        amount: parseFloat(amount),
        timestamp: Date.now()
      });
      setScannedData(qrData);
    }
  };

  const handleScanPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (phoneNumber && amountNum > 0) {
      onPayment(fromAccount, amountNum, `СБП: ${phoneNumber}`);
      setAmount("");
      setPhoneNumber("");
      onClose();
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg backdrop-blur-2xl bg-white/90 border-white/50 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <QrCode className="h-6 w-6" />
            СБП - QR оплата
          </DialogTitle>
          <DialogDescription>
            Система быстрых платежей
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 rounded-2xl">
            <TabsTrigger value="show" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Показать QR
            </TabsTrigger>
            <TabsTrigger value="scan" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Оплатить по QR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="show" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="receive-amount" className="text-base font-medium">Сумма к получению</Label>
              <Input
                id="receive-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-2xl border-gray-200 h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Быстрая сумма</Label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="rounded-xl h-10 font-medium hover:bg-gray-100"
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerateQR} 
              className="w-full rounded-2xl h-12 font-semibold bg-black hover:bg-gray-800"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Сгенерировать QR-код
            </Button>

            {scannedData && (
              <div className="flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-3xl">
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG 
                    value={scannedData} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="mt-6 font-bold text-2xl">{amount} ₽</p>
                <p className="text-sm text-gray-600 mt-2 font-medium">Покажите QR-код для оплаты</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scan" className="space-y-4 mt-6">
            <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50/80 to-gray-100/60 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-3xl">
              <div className="p-4 bg-white/80 rounded-2xl mb-4">
                <Scan className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-gray-700 text-center font-medium">
                Отсканируйте QR-код получателя
                <br />
                <span className="text-sm text-gray-500">или введите данные вручную</span>
              </p>
            </div>

            <form onSubmit={handleScanPay} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">Телефон получателя</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-2xl border-gray-200 h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from" className="text-base font-medium">Откуда списать</Label>
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
                <Label htmlFor="pay-amount" className="text-base font-medium">Сумма</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-2xl border-gray-200 h-12 text-lg"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="rounded-xl h-10 font-medium hover:bg-gray-100"
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-semibold">
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 rounded-2xl h-12 font-semibold bg-black hover:bg-gray-800"
                  disabled={!phoneNumber || !amount || parseFloat(amount) <= 0}
                >
                  Оплатить
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}