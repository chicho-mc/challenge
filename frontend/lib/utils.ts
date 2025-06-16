import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "./logging";

export function cn(...inputs: ClassValue[]) {
  logger.debug("Merging class names", ...inputs);
  return twMerge(clsx(inputs));
}
