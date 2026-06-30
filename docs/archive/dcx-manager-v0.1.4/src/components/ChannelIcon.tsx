import React from "react";
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Phone, 
  Bell, 
  Share2 
} from "lucide-react";

interface ChannelIconProps {
  name: string;
  className?: string;
}

export function ChannelIcon({ name, className = "w-4 h-4" }: ChannelIconProps) {
  switch (name) {
    case "MessageSquare": return <MessageSquare className={className} />;
    case "Mail": return <Mail className={className} />;
    case "Send": return <Send className={className} />;
    case "Phone": return <Phone className={className} />;
    case "Bell": return <Bell className={className} />;
    case "Share2": return <Share2 className={className} />;
    default: return <MessageSquare className={className} />;
  }
}
