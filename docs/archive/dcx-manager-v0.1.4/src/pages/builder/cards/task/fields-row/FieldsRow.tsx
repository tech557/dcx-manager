import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { TaskCardData } from "../../../../../types";
import { SenderField } from "./SenderField";
import { ReceiverField } from "./ReceiverField";
import { MessageField } from "./MessageField";
import { SpecsField } from "./SpecsField";
import { MissingField } from "./MissingField";
import { useTheme } from "../../../../../hooks/useTheme";


export interface FieldsRowProps {
  task: TaskCardData;
  onEdit: (updatedTask: TaskCardData) => void;
}

export function FieldsRow({ task, onEdit }: FieldsRowProps) {
  const hasMessage = !!task.message && task.message.trim().length > 0;
  const hasSender = !!task.senderId;
  const hasReceiver = !!task.receiverId;
  const hasSpecs = !!task.specsIdentifier && task.specsIdentifier.trim().length > 0;
  const hasMissing = !!task.missingData && task.missingData.length > 0;

  const onSaveField = (field: "sender" | "receiver" | "message" | "missing" | "specs", value: any) => {
    let updatedMissingData = [...(task.missingData || [])];
    
    // Automatically clear relevant missing items tags when value is assigned
    if (field === "sender" && value) {
      updatedMissingData = updatedMissingData.filter(
        item => !item.toLowerCase().includes("sender") && !item.toLowerCase().includes("source")
      );
    }
    if (field === "receiver" && value) {
      updatedMissingData = updatedMissingData.filter(
        item => !item.toLowerCase().includes("recipient") && !item.toLowerCase().includes("receiver") && !item.toLowerCase().includes("target")
      );
    }
    if (field === "message" && value && value.trim().length > 0) {
      updatedMissingData = updatedMissingData.filter(
        item => !item.toLowerCase().includes("message") && !item.toLowerCase().includes("copy")
      );
    }

    const updatedTask: TaskCardData = {
      ...task,
      senderId: field === "sender" ? (value || undefined) : task.senderId,
      receiverId: field === "receiver" ? (value || undefined) : task.receiverId,
      message: field === "message" ? value : task.message,
      specsIdentifier: field === "specs" ? value : task.specsIdentifier,
      missingData: field === "missing" ? value : updatedMissingData
    };

    onEdit(updatedTask);
  };

  // 1. Message, 2. Sender, 3. Receiver, 4. Specs, 5. Missing
  const fields = [
    {
      id: "message",
      isActive: hasMessage,
      component: <MessageField task={task} onSaveField={onSaveField} />
    },
    {
      id: "sender",
      isActive: hasSender,
      component: <SenderField task={task} onSaveField={onSaveField} />
    },
    {
      id: "receiver",
      isActive: hasReceiver,
      component: <ReceiverField task={task} onSaveField={onSaveField} />
    },
    {
      id: "specs",
      isActive: hasSpecs,
      component: <SpecsField task={task} onSaveField={onSaveField} />
    },
    {
      id: "missing",
      isActive: hasMissing,
      component: <MissingField task={task} onSaveField={onSaveField} />
    }
  ];

  // Sort: active first, inactive second, preserving initial relative order!
  const sortedFields = [
    ...fields.filter(f => f.isActive),
    ...fields.filter(f => !f.isActive)
  ];

  return (
    <motion.div 
      layout
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
        mass: 0.8
      }}
      className="flex items-center gap-2 mt-1 min-h-[22px] font-sans"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {sortedFields.map((field) => (
          <motion.div
            key={field.id}
            layoutId={`field-container-${task.id}-${field.id}`}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.7
            }}
            className="flex items-center justify-center shrink-0"
          >
            {field.component}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
