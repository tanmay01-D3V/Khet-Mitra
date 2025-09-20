
'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Beaker,
  ScanLine,
  Sprout,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Settings,
  RadioReceiver,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context';
import { useState, useEffect } from 'react';

const slogans = [
    "Sowing seeds of success, reaping fields of dreams. 🌱🌾",
    "The backbone of our nation, the pride of our land. 🇮🇳💪",
    "Cultivating with passion, growing with purpose. 🌻🚜",
    "From soil to soul, the farmer's story unfolds. 📖✨",
    "Working the land, feeding the world. 🌍❤️"
];

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [isSloganVisible, setIsSloganVisible] = useState(true);
  
  const firstName = user?.name.split(' ')[0] || 'Farmer';

  useEffect(() => {
    const interval = setInterval(() => {
        setIsSloganVisible(false); // Start fade out
        setTimeout(() => {
            setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
            setIsSloganVisible(true); // Start fade in
        }, 500); // Time for fade-out transition
    }, 15000); // Change slogan every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: t('quickActions.newScan'),
      icon: <ScanLine className="h-6 w-6" />,
      href: '/disease-identification',
    },
    {
      title: t('quickActions.soilTest'),
      icon: <Beaker className="h-6 w-6" />,
      href: '/soil-analysis',
    },
      {
      title: t('quickActions.fertilizer'),
      icon: <Sprout className="h-6 w-6" />,
      href: '/fertilizer-recommendation',
    },
    {
      title: t('quickActions.marketTrends'),
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/marketplace',
    },
  ];

  const mainFeatures = [
    {
      title: t('mainFeatures.identifyCropDisease.title'),
      description: t('mainFeatures.identifyCropDisease.description'),
      icon: <ScanLine className="h-10 w-10 text-green-600" />,
      href: '/disease-identification',
      cta: t('mainFeatures.identifyCropDisease.cta'),
    },
    {
      title: t('mainFeatures.locationBasedGuidance.title'),
      description: t('mainFeatures.locationBasedGuidance.description'),
      icon: <MapPin className="h-10 w-10 text-green-600" />,
      href: '/location-guidance',
      cta: t('mainFeatures.locationBasedGuidance.cta'),
    },
    {
      title: t('mainFeatures.fairPriceMarketplace.title'),
      description: t('mainFeatures.fairPriceMarketplace.description'),
      icon: <ShoppingCart className="h-10 w-10 text-green-600" />,
      href: '/marketplace',
      cta: t('mainFeatures.fairPriceMarketplace.cta'),
    },
     {
      title: t('mainFeatures.myPollSensor.title'),
      description: t('mainFeatures.myPollSensor.description'),
      icon: <RadioReceiver className="h-10 w-10 text-green-600" />,
      href: '/my-poll', 
      cta: t('mainFeatures.myPollSensor.cta'),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-card/50 border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tight text-foreground">{t('welcomeTitle', { name: firstName })}</CardTitle>
          <CardDescription
            className="text-lg text-muted-foreground mt-2"
            dangerouslySetInnerHTML={{ __html: t('welcomeDescription') }}
          />
          <p className={`text-md text-muted-foreground mt-2 transition-opacity duration-500 ${isSloganVisible ? 'opacity-100' : 'opacity-0'}`}>
            {slogans[currentSloganIndex]}
          </p>
        </CardHeader>
      </Card>
      
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('quickActions.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
               <Button key={action.href} asChild variant="outline" className="h-20 flex-col gap-2 text-md font-semibold transition-all hover:bg-primary/10 hover:shadow-md">
                 <Link href={action.href}>
                   {action.icon}
                   {action.title}
                 </Link>
               </Button>
            ))}
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        {mainFeatures.map((feature) => (
          <Card
            key={feature.href}
            className="flex flex-col justify-between transition-all hover:shadow-xl hover:border-primary/50"
          >
            <CardHeader className="flex-row items-start gap-4 space-y-0">
               {feature.icon}
               <div className="flex-1">
                 <CardTitle className="mb-1 text-2xl">{feature.title}</CardTitle>
                 <CardDescription>{feature.description}</CardDescription>
               </div>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full font-bold">
                <Link href={feature.href}>
                  {feature.cta}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
