import { useState, useEffect } from "react";
import {
  ThemeProvider,
  useTheme,
} from "./contexts/ThemeContext";
import {
  LanguageProvider,
  useLanguage,
} from "./contexts/LanguageContext";
import { AccountCard } from "./components/AccountCard";
import { TransferDialog } from "./components/TransferDialog";
import {
  TransactionHistory,
  Transaction,
} from "./components/TransactionHistory";
import { AddMoneyDialog } from "./components/AddMoneyDialog";
import { QRPaymentDialog } from "./components/QRPaymentDialog";
import { SmartMoneyDialog } from "./components/SmartMoneyDialog";
import { PhonePaymentDialog } from "./components/PhonePaymentDialog";
import { AIDistributionSlider } from "./components/AIDistributionSlider";
import { DailyAdvice } from "./components/DailyAdvice";
import { SpendingWheel } from "./components/SpendingWheel";
import { AIChatDialog } from "./components/AIChatDialog";
import { CategoryInsightDialog } from "./components/CategoryInsightDialog";
import { ContactsQuickTransfer } from "./components/ContactsQuickTransfer";
import { MaryWidget } from "./components/MaryWidget";
import { SliceLogo } from "./components/SliceLogo";
import { MeshBackground } from "./components/MeshBackground";
import { GlassCard } from "./components/GlassCard";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  PieChart,
  Coffee,
  Dumbbell,
  ShoppingCart,
  User,
  Plus,
  ArrowLeftRight,
  QrCode,
  Zap,
  Sparkles,
  Smartphone,
  PiggyBank,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { haptics } from "./utils/haptics";

interface Account {
  id: string;
  name: string;
  nameEn: string;
  balance: number;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

// Spring physics configuration
const springConfig = {
  type: "spring" as const,
  stiffness: 350,
  damping: 28,
};

const bouncySpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 20,
};

const smoothSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
};

function AnimatedBalance({
  value,
  hidden,
}: {
  value: number;
  hidden: boolean;
}) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, springConfig);
  const rounded = useTransform(springValue, (latest) =>
    Math.round(latest),
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  if (hidden) return <span>****</span>;

  return <motion.span>{rounded}</motion.span>;
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "main",
      name: "Основной счёт",
      nameEn: "Main Account",
      balance: 50000,
    },
    {
      id: "personal",
      name: "Личные покупки",
      nameEn: "Personal Purchases",
      balance: 3500,
    },
    {
      id: "coffee",
      name: "Кофе",
      nameEn: "Coffee",
      balance: 1200,
    },
    {
      id: "gym",
      name: "Тренировки",
      nameEn: "Training",
      balance: 4800,
    },
    {
      id: "supermarket",
      name: "Супермаркет",
      nameEn: "Supermarket",
      balance: 6700,
    },
    {
      id: "savings",
      name: "Накопления",
      nameEn: "Savings",
      balance: 2500,
    },
  ]);

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [spendingHistory, setSpendingHistory] = useState<{
    [key: string]: number;
  }>({
    personal: 15000,
    coffee: 8000,
    gym: 12000,
    supermarket: 25000,
  });

  const [transferDialogOpen, setTransferDialogOpen] =
    useState(false);
  const [addMoneyDialogOpen, setAddMoneyDialogOpen] =
    useState(false);
  const [qrPaymentDialogOpen, setQRPaymentDialogOpen] =
    useState(false);
  const [smartMoneyDialogOpen, setSmartMoneyDialogOpen] =
    useState(false);
  const [phonePaymentDialogOpen, setPhonePaymentDialogOpen] =
    useState(false);
  const [aiDistributionOpen, setAiDistributionOpen] =
    useState(false);
  const [aiChatOpen, setAIChatOpen] = useState(false);
  const [categoryInsightOpen, setCategoryInsightOpen] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>("");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<
    string | undefined
  >(undefined);

  const [smartRoundUpEnabled, setSmartRoundUpEnabled] =
    useState(false);
  const [showSavingsAccount, setShowSavingsAccount] =
    useState(false);
  const [balancesHidden, setBalancesHidden] = useState(false);

  const formatBalance = (balance: number) => {
    if (balancesHidden) return "****";
    return balance.toLocaleString(
      language === "ru" ? "ru-RU" : "en-US",
    );
  };

  const getAccountName = (acc: Account) => {
    return language === "ru" ? acc.name : acc.nameEn;
  };

  const handleTransfer = (
    fromId: string,
    toId: string,
    amount: number,
  ) => {
    const fromAccount = accounts.find(
      (acc) => acc.id === fromId,
    );
    const toAccount = accounts.find((acc) => acc.id === toId);

    if (!fromAccount || !toAccount) return;

    if (fromAccount.balance < amount) {
      haptics.error();
      toast.error(t("insufficientFunds"), {
        description: `${t("insufficientFundsDesc")}`,
      });
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId)
          return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId)
          return { ...acc, balance: acc.balance + amount };
        return acc;
      }),
    );

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      from: fromId,
      to: toId,
      amount,
      date: new Date(),
      type: "transfer",
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    haptics.success();
    toast.success(t("transferCompleted"), {
      description: `${amount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽ ${t("transferredTo")} "${getAccountName(toAccount)}"`,
    });
  };

  const handleAddMoney = (
    amount: number,
    distribute: boolean,
  ) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === "main")
          return { ...acc, balance: acc.balance + amount };
        return acc;
      }),
    );

    haptics.success();
    toast.success(t("accountReplenished"), {
      description: `${t("added")} ${amount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽`,
    });

    if (distribute) {
      setPendingAmount(amount);
      setAiDistributionOpen(true);
    }
  };

  const handleAIDistribution = (
    distributions: { accountId: string; amount: number }[],
  ) => {
    const totalAmount = distributions.reduce(
      (sum, d) => sum + d.amount,
      0,
    );
    const mainAccount = accounts.find(
      (acc) => acc.id === "main",
    );

    if (!mainAccount || mainAccount.balance < totalAmount) {
      haptics.error();
      toast.error(t("insufficientFunds"));
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === "main") {
          return { ...acc, balance: acc.balance - totalAmount };
        }
        const distribution = distributions.find(
          (d) => d.accountId === acc.id,
        );
        if (distribution) {
          return {
            ...acc,
            balance: acc.balance + distribution.amount,
          };
        }
        return acc;
      }),
    );

    distributions.forEach(({ accountId, amount }) => {
      const newTransaction: Transaction = {
        id: (Date.now() + Math.random()).toString(),
        from: "main",
        to: accountId,
        amount,
        date: new Date(),
        type: "transfer",
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    });

    haptics.success();
    toast.success(t("aiDistributed"), {
      description: `${totalAmount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽ ${t("autoDistributed")}`,
    });
  };

  const handleSBPPayment = (
    fromId: string,
    amount: number,
    recipient: string,
    rounderAmount: number,
  ) => {
    const fromAccount = accounts.find(
      (acc) => acc.id === fromId,
    );

    if (!fromAccount) return;

    const totalAmount = amount + rounderAmount;

    if (fromAccount.balance < totalAmount) {
      haptics.error();
      toast.error(t("insufficientFunds"), {
        description: `${t("insufficientFundsDesc")}`,
      });
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId)
          return {
            ...acc,
            balance: acc.balance - totalAmount,
          };
        if (acc.id === "savings" && rounderAmount > 0)
          return {
            ...acc,
            balance: acc.balance + rounderAmount,
          };
        return acc;
      }),
    );

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      from: fromId,
      to: recipient,
      amount,
      date: new Date(),
      type: "sbp",
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    haptics.success();
    if (rounderAmount > 0) {
      toast.success(t("sbpPaymentCompleted"), {
        description: `${amount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽ ${t("sent")}. ${t("saved")} ${rounderAmount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽`,
      });
    } else {
      toast.success(t("sbpPaymentCompleted"), {
        description: `${amount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽ ${t("sentViaSbp")}`,
      });
    }
  };

  const handleSmartDistribution = (
    distributions: { accountId: string; amount: number }[],
  ) => {
    handleAIDistribution(distributions);
  };

  const handlePhonePayment = (
    accountId: string,
    amount: number,
    merchant: string,
    mccCode: string,
    rounderAmount: number,
  ) => {
    const account = accounts.find(
      (acc) => acc.id === accountId,
    );

    if (!account) return;

    const totalAmount = amount + rounderAmount;

    if (account.balance < totalAmount) {
      haptics.error();
      toast.error(t("insufficientFunds"), {
        description: `${t("insufficientFundsDesc")}`,
      });
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId)
          return {
            ...acc,
            balance: acc.balance - totalAmount,
          };
        if (acc.id === "savings" && rounderAmount > 0)
          return {
            ...acc,
            balance: acc.balance + rounderAmount,
          };
        return acc;
      }),
    );

    // Update spending history
    setSpendingHistory((prev) => ({
      ...prev,
      [accountId]: (prev[accountId] || 0) + amount,
    }));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      from: accountId,
      to: merchant,
      amount,
      date: new Date(),
      type: "expense",
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    haptics.success();
    if (rounderAmount > 0) {
      toast.success(t("paymentCompleted"), {
        description: `${amount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽ ${t("deducted")}. ${t("saved")} ${rounderAmount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽`,
      });
    } else {
      toast.success(t("paymentCompleted"), {
        description: `${amount.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽ ${t("deductedFrom")} "${getAccountName(account)}"`,
      });
    }
  };

  const openTransferDialog = (accountId?: string) => {
    setSelectedAccount(accountId);
    setTransferDialogOpen(true);
  };

  const handleCategoryClick = (accountId: string) => {
    haptics.light();
    setSelectedCategoryId(accountId);
    setCategoryInsightOpen(true);
  };

  const handleContactSelect = (contact: Contact) => {
    haptics.light();
    toast.info(`${t("transferFor")} ${contact.name}`, {
      description: `${t("openTransferDialog")} ${contact.phone}`,
    });
    openTransferDialog();
  };

  const mainAccount = accounts.find(
    (acc) => acc.id === "main",
  )!;
  const savingsAccount = accounts.find(
    (acc) => acc.id === "savings",
  )!;
  const categoryAccounts = accounts.filter(
    (acc) => acc.id !== "main" && acc.id !== "savings",
  );
  const displayAccounts = showSavingsAccount
    ? [...categoryAccounts, savingsAccount]
    : categoryAccounts;

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  const accountConfig: Record<
    string,
    { icon: React.ReactNode; color: string; budget: number }
  > = {
    personal: {
      icon: <User className="h-6 w-6" />,
      color: "text-purple-600 dark:text-purple-400",
      budget: 10000,
    },
    coffee: {
      icon: <Coffee className="h-6 w-6" />,
      color: "text-amber-600 dark:text-amber-400",
      budget: 5000,
    },
    gym: {
      icon: <Dumbbell className="h-6 w-6" />,
      color: "text-green-600 dark:text-green-400",
      budget: 8000,
    },
    supermarket: {
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "text-blue-600 dark:text-blue-400",
      budget: 15000,
    },
    savings: {
      icon: <PiggyBank className="h-6 w-6" />,
      color: "text-pink-600 dark:text-pink-400",
      budget: 50000,
    },
  };

  // Calculate financial health for Mary
  const getFinancialHealth = ():
    | "good"
    | "warning"
    | "critical" => {
    const totalSpent = Object.values(spendingHistory).reduce(
      (a, b) => a + b,
      0,
    );
    const avgBudget = categoryAccounts.reduce((sum, acc) => {
      return sum + (accountConfig[acc.id]?.budget || 0);
    }, 0);

    const spentRatio = totalSpent / avgBudget;

    if (spentRatio > 0.9) return "critical";
    if (spentRatio > 0.7) return "warning";
    return "good";
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
      <MeshBackground />
      <Toaster />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={bouncySpring}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <SliceLogo className="h-14 w-14" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {t("appTitle")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t("smartBudget")}
              </p>
            </div>
          </motion.div>

          <GlassCard className="px-6 py-4" variant="tab">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {t("totalBalance")}
                </p>
                <p className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
                  <AnimatedBalance
                    value={totalBalance}
                    hidden={balancesHidden}
                  />{" "}
                  ₽
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-600 dark:via-purple-700 dark:to-blue-800"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={bouncySpring}
                >
                  <PieChart className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      haptics.light();
                      setBalancesHidden(!balancesHidden);
                    }}
                    className="hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    {balancesHidden ? (
                      <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      haptics.light();
                      toggleLanguage();
                    }}
                    className="hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="ml-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {language.toUpperCase()}
                    </span>
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      haptics.light();
                      toggleTheme();
                    }}
                    className="hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Smart Features Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.1 }}
        >
          <GlassCard className="p-6" variant="tab">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="smart-roundup"
                    checked={smartRoundUpEnabled}
                    onCheckedChange={(checked) => {
                      haptics.light();
                      setSmartRoundUpEnabled(checked);
                      setShowSavingsAccount(checked);
                      toast.info(
                        checked
                          ? t("smartRounderOn")
                          : t("smartRounderOff"),
                        {
                          description: checked
                            ? t("smartRounderOnDesc")
                            : t("smartRounderOffDesc"),
                        },
                      );
                    }}
                  />
                  <div>
                    <Label
                      htmlFor="smart-roundup"
                      className="text-gray-900 dark:text-gray-100 font-semibold cursor-pointer"
                    >
                      {t("smartRounder")}
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("smartRounderDesc")}
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {smartRoundUpEnabled && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        x: -20,
                      }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -20 }}
                      transition={bouncySpring}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800"
                    >
                      <PiggyBank className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-sm text-pink-700 dark:text-pink-300 font-medium">
                        <AnimatedBalance
                          value={savingsAccount.balance}
                          hidden={balancesHidden}
                        />{" "}
                        ₽
                      </span>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            haptics.light();
                            setShowSavingsAccount(
                              !showSavingsAccount,
                            );
                          }}
                          className="h-6 w-6 p-0 hover:bg-pink-200 dark:hover:bg-pink-800 text-pink-600 dark:text-pink-400"
                        >
                          {showSavingsAccount ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Account */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springConfig, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative overflow-hidden rounded-[2.5rem] p-10 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 dark:from-indigo-700 dark:via-purple-800 dark:to-blue-900 shadow-2xl transition-colors duration-500">
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            <div className="relative flex items-center justify-between flex-wrap gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <PieChart className="h-7 w-7 text-white" />
                  <h2 className="text-2xl font-semibold text-white">
                    {language === "ru"
                      ? mainAccount.name
                      : mainAccount.nameEn}
                  </h2>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Zap className="h-3 w-3 mr-1" />
                    {language === "ru" ? "СБП" : "SBP"}
                  </Badge>
                </div>

                <motion.p
                  className="text-6xl font-bold font-mono text-white mb-8"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springConfig, delay: 0.4 }}
                >
                  <AnimatedBalance
                    value={mainAccount.balance}
                    hidden={balancesHidden}
                  />{" "}
                  ₽
                </motion.p>

                {/* Action chips - horizontal scrollable on mobile */}
                <div className="flex gap-3 flex-wrap overflow-x-auto pb-2 scrollbar-hide">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={bouncySpring}
                  >
                    <Button
                      onClick={() => {
                        haptics.light();
                        setAddMoneyDialogOpen(true);
                      }}
                      className="bg-white text-purple-600 hover:bg-gray-100 rounded-2xl px-6 py-6 text-base font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      {t("topUp")}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={bouncySpring}
                  >
                    <Button
                      onClick={() => {
                        haptics.light();
                        setSmartMoneyDialogOpen(true);
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 rounded-2xl px-6 py-6 text-base font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300 whitespace-nowrap"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t("ai")}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={bouncySpring}
                  >
                    <Button
                      onClick={() => {
                        haptics.light();
                        openTransferDialog("main");
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 rounded-2xl px-6 py-6 text-base font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300 whitespace-nowrap"
                    >
                      <ArrowLeftRight className="h-5 w-5 mr-2" />
                      {t("transfer")}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={bouncySpring}
                  >
                    <Button
                      onClick={() => {
                        haptics.light();
                        setQRPaymentDialogOpen(true);
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 rounded-2xl px-6 py-6 text-base font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300 whitespace-nowrap"
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      {t("qr")}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={bouncySpring}
                  >
                    <Button
                      onClick={() => {
                        haptics.light();
                        setPhonePaymentDialogOpen(true);
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 rounded-2xl px-6 py-6 text-base font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300 whitespace-nowrap"
                    >
                      <Smartphone className="h-5 w-5 mr-2" />
                      {t("nfc")}
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="text-right text-white/90">
                  <p className="text-sm mb-2 text-white/60">
                    {t("cardNumber")}
                  </p>
                  <p className="text-2xl font-mono mb-6 tracking-wider">
                    •••• •••• •••• 4256
                  </p>
                  <p className="text-sm mb-2 text-white/60">
                    {t("validUntil")}
                  </p>
                  <p className="font-mono text-xl tracking-wider">
                    12/28
                  </p>
                </div>
              </div>
            </div>

            {/* Glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Daily Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.25 }}
        >
          <DailyAdvice
            accounts={accounts}
            spendingHistory={spendingHistory}
          />
        </motion.div>

        {/* Contacts Quick Transfer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.28 }}
        >
          <ContactsQuickTransfer
            onSelectContact={handleContactSelect}
          />
        </motion.div>

        {/* Sub Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-500" />
              {t("spendingCategories")}
            </h2>
            <Badge className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
              {t("smartDivision")}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...springConfig,
                  delay: 0.4 + index * 0.05,
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <AccountCard
                  name={getAccountName(account)}
                  balance={balancesHidden ? 0 : account.balance}
                  icon={accountConfig[account.id].icon}
                  color={accountConfig[account.id].color}
                  budget={accountConfig[account.id].budget}
                  onTransfer={() => {
                    haptics.light();
                    openTransferDialog(account.id);
                  }}
                  onClick={() =>
                    handleCategoryClick(account.id)
                  }
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spending Wheel and Apple Wallet placeholder */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.5 }}
          >
            <SpendingWheel
              accounts={accounts}
              spendingHistory={spendingHistory}
              onSegmentClick={handleCategoryClick}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.55 }}
            whileHover={{ scale: 1.02 }}
          >
            <GlassCard
              variant="secondary"
              className="p-6 h-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("appleWallet")}
              </h3>
              <div className="flex flex-col items-center justify-center h-[250px] text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <PieChart className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t("addSliceCard")}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 dark:from-indigo-600 dark:via-purple-700 dark:to-blue-800 text-white"
                    onClick={() => haptics.light()}
                  >
                    {t("addToWallet")}
                  </Button>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.6 }}
        >
          <TransactionHistory
            transactions={transactions}
            accounts={accounts}
          />
        </motion.div>

        {/* Dialogs with AnimatePresence */}
        <AnimatePresence mode="wait">
          {transferDialogOpen && (
            <TransferDialog
              open={transferDialogOpen}
              onClose={() => setTransferDialogOpen(false)}
              onTransfer={handleTransfer}
              accounts={accounts}
              selectedAccount={selectedAccount}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {addMoneyDialogOpen && (
            <AddMoneyDialog
              open={addMoneyDialogOpen}
              onClose={() => setAddMoneyDialogOpen(false)}
              onAddMoney={handleAddMoney}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {aiDistributionOpen && (
            <AIDistributionSlider
              open={aiDistributionOpen}
              onClose={() => setAiDistributionOpen(false)}
              onDistribute={handleAIDistribution}
              totalAmount={pendingAmount}
              accounts={accounts}
              spendingHistory={spendingHistory}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {qrPaymentDialogOpen && (
            <QRPaymentDialog
              open={qrPaymentDialogOpen}
              onClose={() => setQRPaymentDialogOpen(false)}
              onPayment={handleSBPPayment}
              accounts={accounts}
              smartRounderEnabled={smartRoundUpEnabled}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {smartMoneyDialogOpen && (
            <SmartMoneyDialog
              open={smartMoneyDialogOpen}
              onClose={() => setSmartMoneyDialogOpen(false)}
              onDistribute={handleSmartDistribution}
              accounts={accounts}
              spendingHistory={spendingHistory}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {phonePaymentDialogOpen && (
            <PhonePaymentDialog
              open={phonePaymentDialogOpen}
              onClose={() => setPhonePaymentDialogOpen(false)}
              onPayment={handlePhonePayment}
              accounts={accounts}
              smartRounderEnabled={smartRoundUpEnabled}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {aiChatOpen && (
            <AIChatDialog
              open={aiChatOpen}
              onClose={() => setAIChatOpen(false)}
              accounts={accounts}
              onTransfer={handleTransfer}
              onToggleRounder={setSmartRoundUpEnabled}
              onToggleSavingsVisibility={setShowSavingsAccount}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {selectedCategoryId && categoryInsightOpen && (
            <CategoryInsightDialog
              open={categoryInsightOpen}
              onClose={() => setCategoryInsightOpen(false)}
              accountId={selectedCategoryId}
              accountName={
                getAccountName(
                  accounts.find(
                    (acc) => acc.id === selectedCategoryId,
                  )!,
                ) || ""
              }
              balance={
                accounts.find(
                  (acc) => acc.id === selectedCategoryId,
                )?.balance || 0
              }
              budget={
                accountConfig[selectedCategoryId]?.budget || 0
              }
              icon={accountConfig[selectedCategoryId]?.icon}
              color={
                accountConfig[selectedCategoryId]?.color || ""
              }
              spendingHistory={
                spendingHistory[selectedCategoryId] || 0
              }
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mary Widget - Peek-a-Boo */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...smoothSpring, delay: 1 }}
      >
        <MaryWidget
          onClick={() => {
            haptics.medium();
            setAIChatOpen(true);
          }}
          financialHealth={getFinancialHealth()}
        />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}