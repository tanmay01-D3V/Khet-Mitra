
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LocateFixed, Users, Send, Phone, Mic } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context';
import { getAddressFromCoordinates } from '@/ai/flows/get-address-from-coordinates-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type ChatroomState = 'initial' | 'locating' | 'joining' | 'in_chatroom';

type Message = {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  isSelf: boolean;
};

const mockUsers = [
    { name: 'राजेश कुमार', avatar: 'https://avatar.vercel.sh/rajesh.png' },
    { name: 'सीता देवी', avatar: 'https://avatar.vercel.sh/sita.png' },
    { name: 'अमित सिंह', avatar: 'https://avatar.vercel.sh/amit.png' },
];

const mockMessages: Omit<Message, 'isSelf'>[] = [
    { id: 1, user: mockUsers[0], text: 'नमस्ते भाई, इस हफ्ते किसी के टमाटर के पौधों में कीड़े लगे हैं क्या?', timestamp: '10:30 AM' },
    { id: 2, user: mockUsers[1], text: 'हाँ राजेश भाई! Maine aaj subah neem oil spray kiya. Usse fayda ho raha hai.', timestamp: '10:32 AM' },
    { id: 3, user: mockUsers[2], text: 'Accha, ye to badiya hai. Kal mausam vibhag ne बारिश की chetavani di hai, taiyaar rehna.', timestamp: '10:35 AM' },
    { id: 4, user: mockUsers[0], text: 'Shukriya, Amit bhai. Main abhi sinchai karne hi wala tha.', timestamp: '10:36 AM' },
];


export default function ChatroomPage() {
  const [chatroomState, setChatroomState] = useState<ChatroomState>('initial');
  const [location, setLocation] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation('chatroom');
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const handleFindChatroom = async () => {
    setChatroomState('locating');
    if (!navigator.geolocation) {
      toast({ title: t('toast.noGeolocation.title'), variant: 'destructive' });
      setChatroomState('initial');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await getAddressFromCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocation(address);
          setChatroomState('joining');
          toast({ title: t('toast.locationFound.title'), description: t('toast.locationFound.description', { location: address }) });
          
          // Simulate joining chatroom
          setTimeout(() => {
            const initialMessages = mockMessages.map(msg => ({ ...msg, isSelf: false }));
            setMessages(initialMessages);
            setChatroomState('in_chatroom');
          }, 2000);

        } catch (error) {
          toast({ title: t('toast.addressError.title'), variant: 'destructive' });
          setChatroomState('initial');
        }
      },
      () => {
        toast({ title: t('toast.permissionError.title'), description: t('toast.permissionError.description'), variant: 'destructive' });
        setChatroomState('initial');
      }
    );
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now(),
      user: { name: user.name, avatar: user.photo || `https://avatar.vercel.sh/${user.name}.png` },
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };


  const renderContent = () => {
    switch (chatroomState) {
      case 'in_chatroom':
        return (
          <Card className="w-full h-[75vh] flex flex-col">
            <CardHeader className="flex-row items-center justify-between border-b">
                <div>
                    <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" /> {t('chatroomCard.title', { location })}</CardTitle>
                    <CardDescription>{t('chatroomCard.description', { count: mockUsers.length + 1})}</CardDescription>
                </div>
                 <Button variant="outline" size="icon" onClick={() => toast({ title: t('toast.voiceChat.title')})}>
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Start Voice Chat</span>
                 </Button>
            </CardHeader>
             <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                     <div className="p-6 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={cn("flex items-start gap-3", msg.isSelf && "justify-end")}>
                                {!msg.isSelf && <Avatar className="h-10 w-10 border"><AvatarImage src={msg.user.avatar} /><AvatarFallback>{msg.user.name[0]}</AvatarFallback></Avatar>}
                                <div className={cn("max-w-xs rounded-lg px-4 py-2", msg.isSelf ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                    {!msg.isSelf && <p className="text-xs font-bold mb-1">{msg.user.name}</p>}
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={cn("text-xs mt-1", msg.isSelf ? "text-primary-foreground/70" : "text-muted-foreground/70", !msg.isSelf && "text-right")}>{msg.timestamp}</p>
                                </div>
                                 {msg.isSelf && <Avatar className="h-10 w-10 border"><AvatarImage src={msg.user.avatar} /><AvatarFallback>{user?.name?.[0]}</AvatarFallback></Avatar>}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
             </CardContent>
             <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={t('chatroomCard.inputPlaceholder')} />
                    <Button type="submit" size="icon"><Send className="h-5 w-5" /></Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => toast({ title: t('toast.voiceMessage.title')})}><Mic className="h-5 w-5" /></Button>
                </form>
             </div>
          </Card>
        );
      case 'locating':
      case 'joining':
        return (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <CardTitle>{chatroomState === 'locating' ? t('locatingCard.title') : t('joiningCard.title')}</CardTitle>
            <CardDescription>{chatroomState === 'locating' ? t('locatingCard.description') : t('joiningCard.description')}</CardDescription>
          </Card>
        );
      case 'initial':
      default:
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>{t('initialCard.title')}</CardTitle>
              <CardDescription>{t('initialCard.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleFindChatroom}>
                <LocateFixed className="mr-2 h-4 w-4" />
                {t('initialCard.button')}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <div className="flex justify-center items-start">
        {renderContent()}
      </div>
    </div>
  );
}
