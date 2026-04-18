import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { Users } from "lucide-react";
import { Button } from "./ui/button";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

interface ContactsQuickTransferProps {
  onSelectContact: (contact: Contact) => void;
}

export function ContactsQuickTransfer({ onSelectContact }: ContactsQuickTransferProps) {
  const contacts: Contact[] = [
    { id: "1", name: "Анна", avatar: "👩", phone: "+7 999 123-45-67" },
    { id: "2", name: "Максим", avatar: "👨", phone: "+7 999 234-56-78" },
    { id: "3", name: "Елена", avatar: "👩‍🦰", phone: "+7 999 345-67-89" },
    { id: "4", name: "Иван", avatar: "👨‍💼", phone: "+7 999 456-78-90" },
  ];

  return (
    <GlassCard className="p-6" variant="secondary">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        Быстрый перевод
      </h3>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 350, 
              damping: 28,
              delay: index * 0.05 
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              onClick={() => onSelectContact(contact)}
              className="flex-col h-auto p-4 gap-2 min-w-[80px] hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-2xl"
            >
              <div className="text-4xl">{contact.avatar}</div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {contact.name}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
