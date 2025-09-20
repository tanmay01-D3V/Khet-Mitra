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
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickActions = [
  {
    title: 'New Scan',
    icon: <ScanLine className="h-6 w-6" />,
    href: '/disease-identification',
  },
  {
    title: 'Soil Test',
    icon: <Beaker className="h-6 w-6" />,
    href: '/soil-analysis',
  },
    {
    title: 'Fertilizer',
    icon: <Sprout className="h-6 w-6" />,
    href: '/fertilizer-recommendation',
  },
  {
    title: 'Market Trends',
    icon: <TrendingUp className="h-6 w-6" />,
    href: '/marketplace',
  },
];

const mainFeatures = [
  {
    title: 'Identify Crop Disease',
    description: 'Upload a photo of your crop to get an instant disease diagnosis and treatment advice.',
    icon: <ScanLine className="h-10 w-10 text-primary" />,
    href: '/disease-identification',
    cta: 'Start Scanning',
  },
  {
    title: 'Location-Based Guidance',
    description: 'Use your location to get tailored crop and soil advice for your area.',
    icon: <MapPin className="h-10 w-10 text-primary" />,
    href: '/location-guidance',
    cta: 'Get Local Advice',
  },
  {
    title: 'Fair Price Marketplace',
    description: 'Sell your harvest directly through our marketplace for a fair price that benefits you.',
    icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    href: '/marketplace',
    cta: 'Enter Marketplace',
  },
   {
    title: 'Settings',
    description: 'Customize your application preferences and account details.',
    icon: <Settings className="h-10 w-10 text-primary" />,
    href: '#', // Update with settings page if it exists
    cta: 'Go to Settings',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-card/50 border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tight text-foreground">Welcome Back, Farmer!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your digital toolkit for smarter farming. Let&apos;s make today productive.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Quick Actions</h2>
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
