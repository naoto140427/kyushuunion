import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE_TRANSITION = {
  duration: 0.8,
  ease: [0.87, 0.05, 0.02, 0.97] as [number, number, number, number]
};
