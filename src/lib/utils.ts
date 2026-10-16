import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Go to an in-page anchor. The deck (layout/Deck) turns to its slides and scrolls to everything else. */
export function scrollToId(id: string) {
  window.dispatchEvent(new CustomEvent("navigate", { detail: id }));
}
