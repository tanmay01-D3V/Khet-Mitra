
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

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');

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
      icon: <ScanLine className="h-10 w-10 text-primary" />,
      href: '/disease-identification',
      cta: t('mainFeatures.identifyCropDisease.cta'),
    },
    {
      title: t('mainFeatures.locationBasedGuidance.title'),
      description: t('mainFeatures.locationBasedGuidance.description'),
      icon: <MapPin className="h-10 w-10 text-primary" />,
      href: '/location-guidance',
      cta: t('mainFeatures.locationBasedGuidance.cta'),
    },
    {
      title: t('mainFeatures.fairPriceMarketplace.title'),
      description: t('mainFeatures.fairPriceMarketplace.description'),
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      href: '/marketplace',
      cta: t('mainFeatures.fairPriceMarketplace.cta'),
    },
     {
      title: t('mainFeatures.myPollSensor.title'),
      description: t('mainFeatures.myPollSensor.description'),
      icon: <RadioReceiver className="h-10 w-10 text-primary" />,
      href: '/my-poll', 
      cta: t('mainFeatures.myPollSensor.cta'),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-card/50 border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tight text-foreground">{t('welcomeTitle')}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {t('welcomeDescription')}
          </CardDescription>
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
