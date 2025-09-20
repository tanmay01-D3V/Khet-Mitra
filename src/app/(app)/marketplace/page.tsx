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
import { Badge } from '@/components/ui/badge';

const products = [
  {
    name: 'Wheat Grains',
    price: '18.50',
    unit: 'quintal',
    imageId: 'wheat-grains',
  },
  {
    name: 'Basmati Rice',
    price: '32.00',
    unit: 'quintal',
    imageId: 'rice-paddy',
  },
  {
    name: 'Yellow Corn',
    price: '15.75',
    unit: 'quintal',
    imageId: 'corn-field',
  },
  {
    name: 'Barley',
    price: '21.00',
    unit: 'quintal',
    imageId: 'barley-field',
  },
  {
    name: 'Soybeans',
    price: '45.30',
    unit: 'quintal',
    imageId: 'soybean-field',
  },
  {
    name: 'Sunflower Seeds',
    price: '55.00',
    unit: 'quintal',
    imageId: 'sunflower-field',
  },
];

export default function MarketplacePage() {
  const imageMap = new Map(
    PlaceHolderImages.map((img) => [img.id, img])
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Sell your grains at a fair price, directly to buyers.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = imageMap.get(product.imageId);
          return (
            <Card key={product.name} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
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
                    <CardTitle>{product.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${product.price}</span>
                    <span className="text-muted-foreground">/ {product.unit}</span>
                 </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full" variant="outline">View Details</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
