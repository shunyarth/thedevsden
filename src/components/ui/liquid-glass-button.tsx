"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidbuttonVariants = cva(
  "group/liquid relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl text-sm font-semibold whitespace-nowrap text-gold-soft outline-none transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ink active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "hover:scale-[1.04] motion-reduce:hover:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-4 text-xs has-[>svg]:px-4",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 text-base has-[>svg]:px-6",
        xxl: "h-14 px-10 text-base has-[>svg]:px-8",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "xxl" },
  },
);

type LiquidButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean };

/**
 * Gold "liquid glass" button. Use `asChild` to style a link: `<LiquidButton asChild><a href="…">…</a></LiquidButton>`.
 * The glass distortion needs `<GlassFilter />` rendered once on the page (it lives in the root layout).
 */
function LiquidButton({ className, variant, size, asChild = false, children, ...props }: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp data-slot="button" className={cn(liquidbuttonVariants({ variant, size, className }))} {...props}>
      {/* Glass: SVG distortion in Chrome/Edge, frosted blur everywhere else (see .liquid-glass in globals.css) */}
      <span aria-hidden className="liquid-glass absolute inset-0 -z-20 overflow-hidden rounded-2xl" />
      {/* Bevel: warm gold edge highlights */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-2xl shadow-[0_0_8px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.25),inset_3px_3px_0.5px_-3.5px_rgba(253,230,138,0.12),inset_-3px_-3px_0.5px_-3.5px_rgba(253,230,138,0.7),inset_1px_1px_1px_-0.5px_rgba(253,230,138,0.5),inset_-1px_-1px_1px_-0.5px_rgba(253,230,138,0.45),inset_0_0_6px_6px_rgba(251,191,36,0.07),inset_0_0_2px_2px_rgba(251,191,36,0.05),0_0_12px_rgba(0,0,0,0.3)]"
      />
      {/* Hover glow — fades in with opacity only */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-2xl opacity-0 shadow-[0_0_28px_-4px_rgba(251,191,36,0.55),inset_0_0_14px_rgba(251,191,36,0.14)] transition-opacity duration-500 group-hover/liquid:opacity-100 group-focus-visible/liquid:opacity-100"
      />
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

/** The one shared SVG filter behind every liquid button. Render it once, in the root layout. */
function GlassFilter() {
  return (
    <svg aria-hidden focusable="false" width="0" height="0" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves={1} seed={1} result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export { LiquidButton, GlassFilter, liquidbuttonVariants };
