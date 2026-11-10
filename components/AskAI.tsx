'use client';
import Icon from './Icon';
import { requestAssistant } from '@/lib/assistant';

export default function AskAI() {
  return <button type="button" className="ask-ai-trigger" aria-label="Ask AI about Cascon" aria-haspopup="dialog" aria-controls="contact-assistant-dialog" onClick={() => requestAssistant('ai', 'faq')}><Icon name="sparkles" /><span>Ask AI about Cascon</span><Icon name="arrow-up-right" /></button>;
}
