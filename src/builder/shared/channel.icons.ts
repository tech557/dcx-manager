import { Mail, Bell, Share2, MessageSquare, Image, Newspaper, MessageSquareText, Circle } from 'lucide-react';

export const CHANNEL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  email: Mail,
  push: Bell,
  social: Share2,
  sms: MessageSquareText,
  chat: MessageSquare,
  banner: Image,
  press: Newspaper,
};

export function getChannelIcon(channelId: string) {
  if (!channelId) return Circle;
  const norm = channelId.toLowerCase().trim();
  if (norm === 'none' || norm === 'empty' || norm === 'unset' || norm === '') return Circle;
  if (norm.includes('email') || norm === 'mail') return CHANNEL_ICONS.email;
  if (norm.includes('push') || norm.includes('notification')) return CHANNEL_ICONS.push;
  if (norm.includes('social') || norm.includes('instagram') || norm.includes('facebook') || norm.includes('twitter')) return CHANNEL_ICONS.social;
  if (norm.includes('sms') || norm.includes('text')) return CHANNEL_ICONS.sms;
  if (norm.includes('chat') || norm.includes('whatsapp') || norm.includes('slack')) return CHANNEL_ICONS.chat;
  if (norm.includes('banner') || norm.includes('image')) return CHANNEL_ICONS.banner;
  if (norm.includes('press') || norm.includes('news')) return CHANNEL_ICONS.press;
  return Circle;
}
