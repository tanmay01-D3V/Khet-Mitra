
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { Loader2, MessageCircle, Send, Volume2, Mic } from 'lucide-react';
import { paramMitrChat } from '@/ai/flows/param-mitr-chat-flow';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Logo } from '../logo';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  audioDataUri?: string;
  id: number;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation('chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // SpeechRecognition might be prefixed in some browsers. Moved inside component to avoid SSR errors.
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
  
  const playAudio = useCallback((audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [language, SpeechRecognition]);


  useEffect(() => {
    if (isOpen) {
        setMessages([{
            text: t('welcomeMessage'),
            sender: 'bot',
            id: Date.now(),
        }]);
    }
  }, [isOpen, t]);

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user', id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await paramMitrChat({ message: input, language });
      const botMessage: Message = { 
          text: result.response, 
          sender: 'bot',
          audioDataUri: result.audioDataUri,
          id: Date.now()
      };
      setMessages((prev) => [...prev, botMessage]);
      if (result.audioDataUri) {
        playAudio(result.audioDataUri);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { text: t('errorMessage'), sender: 'bot', id: Date.now() };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-8 w-8" />
        <span className="sr-only">{t('openChat')}</span>
      </Button>
      <audio ref={audioRef} className="hidden" />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] grid-rows-[auto_1fr_auto] p-0 max-h-[80vh]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
                <Logo />
                {t('title')}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-96" ref={scrollAreaRef}>
             <div className="p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.sender === 'bot' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>PM</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-[75%] rounded-lg px-3 py-2 relative group", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <p className="text-sm">{msg.text}</p>
                            {msg.audioDataUri && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => playAudio(msg.audioDataUri!)}
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>PM</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2">
                           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('inputPlaceholder')}
                autoComplete="off"
                disabled={isLoading}
              />
               <Button type="button" size="icon" onClick={toggleRecording} variant={isRecording ? 'destructive' : 'outline'} disabled={isLoading || !SpeechRecognition}>
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">{t('sendButton')}</span>
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
