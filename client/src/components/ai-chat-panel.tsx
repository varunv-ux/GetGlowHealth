import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Analysis } from "@shared/schema";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  analysis: Analysis;
  onClose: () => void;
}

export default function AIChatPanel({ analysis, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async ({ message, context }: { message: string; context: any }) => {
      const response = await apiRequest('POST', `/api/analysis/${analysis.id}/chat`, { message, context });
      return await response.json();
    },
    onSuccess: (response) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send message with analysis context
    chatMutation.mutate({
      message: inputValue,
      context: {
        analysisId: analysis.id,
        analysisData: analysis.analysisData,
        previousMessages: messages
      }
    });

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white flex flex-col flex-1 h-full items-center justify-start max-w-[1000px] min-w-[504px] overflow-hidden rounded-3xl">
      
      {/* Header */}
      <div className="w-full border-b border-[#f4f4f0] flex-shrink-0">
        <div className="flex flex-row items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-[#0c0a09]" />
            <div className="text-[24px] font-bold leading-[28px] text-[#0c0a09] font-es-rebond">
              Ask GlowAI
            </div>
            <Badge variant="outline" className="text-[#0c0a09] border-[#0c0a09] bg-[#f4f4f0]">
              GPT-4.1
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-[#f4f4f0]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="w-full flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 text-[#79716b]" />
                <div className="text-[16px] leading-[24px] text-[#0c0a09] font-medium font-ibm-plex-sans mb-2">
                  Ask me anything about your analysis!
                </div>
                <div className="text-[14px] leading-[20px] text-[#79716b] font-normal font-ibm-plex-sans max-w-md mx-auto">
                  I can help explain your health scores, provide recommendations, or answer questions about your facial analysis results.
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user' 
                        ? 'bg-[#0c0a09] text-white' 
                        : 'bg-[#f4f4f0] text-[#0c0a09]'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {message.role === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                        <span className="text-[12px] leading-[16px] opacity-70 font-ibm-plex-sans">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-[14px] leading-[20px] font-ibm-plex-sans whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-[#f4f4f0] text-[#0c0a09] rounded-2xl p-4 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-3 h-3" />
                        <span className="text-[12px] leading-[16px] opacity-70 font-ibm-plex-sans">
                          Thinking...
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-[14px] leading-[20px] font-ibm-plex-sans">
                          Analyzing your question...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="w-full border-t border-[#f4f4f0] p-5 flex-shrink-0">
        <div className="space-y-4">
          {/* Input Field */}
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your analysis results..."
              disabled={chatMutation.isPending}
              className="flex-1 rounded-2xl border-[#e7e5e4] bg-[#f9f9f6] px-4 py-3 text-[14px] leading-[20px] font-ibm-plex-sans placeholder:text-[#79716b] focus:border-[#0c0a09] focus:ring-1 focus:ring-[#0c0a09]"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || chatMutation.isPending}
              className="bg-[#0c0a09] hover:bg-[#292524] text-white rounded-2xl px-6 py-3 h-auto"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Questions */}
          <div className="space-y-3">
            <div className="text-[12px] leading-[16px] text-[#79716b] font-ibm-plex-sans">
              Quick questions:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "What does my overall score mean?",
                "How can I improve my skin health?",
                "Are there any concerning areas?",
                "What supplements should I consider?"
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-[12px] leading-[16px] font-ibm-plex-sans bg-white border-[#e7e5e4] text-[#79716b] hover:bg-[#f4f4f0] hover:border-[#0c0a09] hover:text-[#0c0a09] rounded-xl px-3 py-2 h-auto"
                  disabled={chatMutation.isPending}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 