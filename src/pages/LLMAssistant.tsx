import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  hasSteps?: boolean;
  providerUrl?: string;
}

const KNOWN_PROVIDERS: Record<string, { steps: string[]; url: string }> = {
  netflix: {
    steps: [
      "Open Netflix app or visit netflix.com",
      "Go to Account settings",
      "Click 'Cancel Membership'",
      "Confirm cancellation",
      "You'll have access until the end of your billing period"
    ],
    url: "https://www.netflix.com/cancelplan"
  },
  spotify: {
    steps: [
      "Open Spotify app or visit spotify.com/account",
      "Click on 'Subscription' in the menu",
      "Select 'Change plan' or 'Cancel Premium'",
      "Follow the prompts to confirm",
      "Premium benefits end at the next billing date"
    ],
    url: "https://www.spotify.com/account/subscription/"
  },
  "amazon prime": {
    steps: [
      "Go to Amazon.in and sign in",
      "Navigate to 'Account & Lists' → 'Prime Membership'",
      "Click 'End Membership'",
      "Follow the cancellation flow",
      "Confirm your choice"
    ],
    url: "https://www.amazon.in/mc/manageyourmembership"
  },
};

export default function LLMAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I can help you cancel or pause your subscriptions. Which service would you like help with?"
    }
  ]);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate LLM response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let assistantMessage: Message;

      // Check if we know this provider
      const knownProvider = Object.keys(KNOWN_PROVIDERS).find(key => 
        lowerInput.includes(key)
      );

      if (knownProvider) {
        const provider = KNOWN_PROVIDERS[knownProvider];
        assistantMessage = {
          role: "assistant",
          content: `Here's how to cancel ${knownProvider.charAt(0).toUpperCase() + knownProvider.slice(1)}:\n\n${provider.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}`,
          hasSteps: true,
          providerUrl: provider.url
        };
      } else {
        assistantMessage = {
          role: "assistant",
          content: "I don't have specific cancellation steps for this provider. Here's a general checklist:\n\n1. Open the provider's app or website\n2. Navigate to Billing or Subscription settings\n3. Look for 'Manage Subscription' or 'Cancel'\n4. Follow the cancellation flow\n5. Confirm and save any confirmation emails",
          hasSteps: false,
          providerUrl: "#"
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
    }, 800);

    setInput("");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Steps copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full animate-fade-in">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Bot className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cancellation Assistant</h1>
              <p className="text-sm text-muted-foreground">Powered by AI</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "glass-card"
                }`}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p>
                
                {msg.role === "assistant" && msg.hasSteps && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="gold-outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopy(msg.content)}
                    >
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {copied ? "Copied!" : "Copy Steps"}
                    </Button>
                    {msg.providerUrl && msg.providerUrl !== "#" && (
                      <Button
                        variant="gold"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(msg.providerUrl, "_blank")}
                      >
                        <ExternalLink size={16} />
                        Open Site
                      </Button>
                    )}
                  </div>
                )}

                {msg.role === "assistant" && !msg.hasSteps && msg.providerUrl === "#" && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">
                      Try searching for "[Provider Name] cancel subscription" in your browser
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 pb-24 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Which service? (e.g., Netflix)"
              className="glass-card"
            />
            <Button
              variant="gold"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}
