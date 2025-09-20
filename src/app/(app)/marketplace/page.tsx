
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';


const products = [
  {
    nameKey: 'wheatGrains',
    price: '18.50',
    unit: 'quintal',
    imageId: 'wheat-grains',
  },
  {
    nameKey: 'basmatiRice',
    price: '32.00',
    unit: 'quintal',
    imageId: 'rice-paddy',
  },
  {
    nameKey: 'yellowCorn',
    price: '15.75',
    unit: 'quintal',
    imageId: 'corn-field',
  },
  {
    nameKey: 'barley',
    price: '21.00',
    unit: 'quintal',
    imageId: 'barley-field',
  },
  {
    nameKey: 'soybeans',
    price: '45.30',
    unit: 'quintal',
    imageId: 'soybean-field',
  },
  {
    nameKey: 'sunflowerSeeds',
    price: '55.00',
    unit: 'quintal',
    imageId: 'sunflower-field',
  },
];

export default function MarketplacePage() {
  const imageMap = new Map(
    PlaceHolderImages.map((img) => [img.id, img])
  );
  const { t } = useTranslation('marketplace');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = imageMap.get(product.imageId);
          return (
            <Card key={product.nameKey} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
              <CardHeader className="p-0">
                {image && (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      data-ai-hint={image.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 pb-2">
                    <CardTitle>{t(`products.${product.nameKey}`)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${product.price}</span>
                    <span className="text-muted-foreground">/ {product.unit}</span>
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
