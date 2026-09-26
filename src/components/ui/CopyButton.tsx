"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  /** Screen-reader label, e.g. "Copy email address". */
  label: string;
  className?: string;
};

// Small icon button that copies text and shows a "Copied" bubble.
export function CopyButton({ text, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-[color,transform] duration-300 hover:text-gold active:scale-90",
          className,
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-gold" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
      {/* Positioning lives on this wrapper, because the bubble's own transform is animated */}
      <span aria-hidden className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2">
        <AnimatePresence>
          {copied && (
            <m.span
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="block rounded-md border border-gold/30 bg-surface-2 px-2 py-1 text-xs font-medium whitespace-nowrap text-gold-soft shadow-lg"
            >
              Copied
            </m.span>
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}
