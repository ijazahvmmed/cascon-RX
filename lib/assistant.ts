export type AssistantView = 'contact' | 'ai';
export type AssistantPlacement = 'floating_button' | 'faq';
export type AssistantRequest = { view: AssistantView; placement: AssistantPlacement; id: number };
let currentRequest: AssistantRequest | null = null;
let sequence = 0;
const listeners = new Set<() => void>();

// Keep a request until the dialog subscribes, including during selective hydration.
export function requestAssistant(view: AssistantView = 'contact', placement: AssistantPlacement = 'floating_button') {
  currentRequest = { view, placement, id: ++sequence };
  listeners.forEach(listener => listener());
}
export const getAssistantRequest = () => currentRequest;
export const getServerAssistantRequest = () => null;
export function subscribeToAssistant(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
