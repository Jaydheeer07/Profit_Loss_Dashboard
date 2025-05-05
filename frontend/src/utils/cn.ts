/**
 * Utility function for merging class names with Tailwind CSS.
 * This is used by UI components to handle class name variants.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names together, resolving Tailwind CSS conflicts.
 * 
 * @param inputs - Class names to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
