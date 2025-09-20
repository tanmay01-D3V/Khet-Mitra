
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Wheat, Bean, Sun, Wind, Leaf } from 'lucide-react';
import React from 'react';

// A simple component to render a fallback icon
const FallbackIcon = () => <Leaf className="h-12 w-12 text-primary" />;

const products = [
  {
    nameKey: 'wheatGrains',
    price: '2275',
    unit: 'quintal',
    icon: <Wheat className="h-12 w-12 text-primary" />,
  },
  {
    nameKey: 'basmatiRice',
    price: '4500',
    unit: 'quintal',
    // Using a simple text symbol as a fallback when no direct icon is available
    icon: <span className="text-4xl">🌾</span>,
  },
  {
    nameKey: 'yellowCorn',
    price: '2150',
    unit: 'quintal',
    icon: <span className="text-4xl">🌽</span>,
  },
  {
    nameKey: 'barley',
    price: '2000',
    unit: 'quintal',
    icon: <Wind className="h-12 w-12 text-primary" />,
  },
  {
    nameKey: 'soybeans',
    price: '4800',
    unit: 'quintal',
    icon: <Bean className="h-12 w-12 text-primary" />,
  },
  {
    nameKey: 'sunflowerSeeds',
    price: '5500',
    unit: 'quintal',
    icon: <Sun className="h-12 w-12 text-primary" />,
  },
];

export default function MarketplacePage() {
  const { t } = useTranslation('marketplace');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          return (
            <Card key={product.nameKey} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
              <CardHeader className="flex-grow items-center justify-center p-6 text-center">
                 {product.icon || <FallbackIcon />}
              </CardHeader>
              <CardContent className="p-6 pt-0 text-center">
                 <CardTitle className="mb-2">{t(`products.${product.nameKey}`)}</CardTitle>
                 <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold">Rs {product.price}</span>
                    <span className="text-muted-foreground">/ {t(`units.${product.unit}`)}</span>
                 </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full" variant="outline">{t('viewDetailsButton')}</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
