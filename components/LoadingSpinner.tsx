import React from "react";
import { cn } from "../lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

const BLADE_COUNT = 8;
const BLADES = Array.from({ length: BLADE_COUNT });

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={cn("relative w-6 h-6 inline-block", className)} role="status" aria-label="読み込み中">
      {BLADES.map((_, i) => {
        const angle = (360 / BLADE_COUNT) * i;
        return (
          <span
            key={i}
            className="spinner-blade absolute left-1/2 top-0 h-1/2 w-[9%] origin-bottom rounded-full bg-subtle"
            style={{
              transform: `translateX(-50%) rotate(${angle}deg)`,
              animationDelay: `${-(BLADE_COUNT - i) * (1 / BLADE_COUNT)}s`,
            }}
          />
        );
      })}
    </div>
  );
};
