import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Beaker,
  ScanLine,
  Sprout,
  MapPin,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const featureCards = [
  {
    title: 'Identify Crop Disease',
    description: 'Upload a photo of your crop to get an instant disease diagnosis and treatment advice.',
    icon: <ScanLine className="h-8 w-8 text-accent" />,
    href: '/disease-identification',
    cta: 'Scan Crop',
  },
  {
    title: 'Analyze Your Soil',
    description: 'Submit your soil test results to receive crop recommendations tailored to your land.',
    icon: <Beaker className="h-8 w-8 text-accent" />,
    href: '/soil-analysis',
    cta: 'Analyze Soil',
  },
  {
    title: 'Get Fertilizer Advice',
    description: 'Find the perfect fertilizer mix for your specific crop and soil conditions to boost your yield.',
    icon: <Sprout className="h-8 w-8 text-accent" />,
    href: '/fertilizer-recommendation',
    cta: 'Get Advice',
  },
  {
    title: 'Fair Price Marketplace',
    description: 'Sell your harvest directly through our marketplace for a fair price that benefits you.',
    icon: <ShoppingCart className="h-8 w-8 text-accent" />,
    href: '/marketplace',
    cta: 'Visit Market',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Farmer!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your overview. Ready to grow?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {featureCards.map((feature) => (
          <Card
            key={feature.href}
            className="flex flex-col justify-between transition-all hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-1">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                {feature.icon}
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="group">
                <Link href={feature.href}>
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
