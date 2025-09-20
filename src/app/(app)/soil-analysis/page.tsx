
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  recommendCropsBasedOnSoilAnalysis,
  type RecommendCropsBasedOnSoilAnalysisOutput,
} from '@/ai/flows/recommend-crops-based-on-soil-analysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trees, FlaskConical, Upload, LocateFixed } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { fileToDataUri } from '@/lib/utils';
import { getAddressFromCoordinates } from '@/ai/tools/reverse-geocoding';


const formSchema = z.object({
  soilReport: z.instanceof(File).refine((file) => file.size > 0, "Please upload your soil report."),
  location: z.string().min(3, "Please provide your farm's location."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SoilAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<RecommendCropsBasedOnSoilAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation('soil-analysis');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilReport: undefined,
      location: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('soilReport', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFetchLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await getAddressFromCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          form.setValue('location', address);
        } catch (error) {
           toast({
            title: "Could not fetch address.",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        } finally {
            setIsFetchingLocation(false);
        }
      },
      () => {
        toast({
          title: "Unable to retrieve your location.",
          description: "Please ensure location services are enabled and try again.",
          variant: "destructive",
        });
        setIsFetchingLocation(false);
      }
    );
  };


  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const dataUri = await fileToDataUri(data.soilReport);
      const result = await recommendCropsBasedOnSoilAnalysis({
        soilReportDataUri: dataUri,
        location: data.location
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing data:', error);
      toast({
        title: t('toast.failed.title'),
        description: t('toast.failed.description'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('formCard.title')}</CardTitle>
          <CardDescription>{t('formCard.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="soilReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formCard.form.soilTestResultsLabel')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                           {imagePreview ? (
                              <Image src={imagePreview} alt="Soil report preview" layout="fill" objectFit="cover" />
                           ) : (
                              <Upload className="h-8 w-8 text-muted-foreground" />
                           )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="max-w-xs"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Upload a picture of your soil analysis report.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                   <FormItem>
                    <FormLabel>{t('formCard.form.locationLabel')}</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={t('formCard.form.locationPlaceholder')} {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                            {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                             <span className="ml-2 hidden sm:inline">Fetch My Location</span>
                        </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('formCard.form.analyzingButton')}
                  </>
                ) : (
                  t('formCard.form.getRecommendationsButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader className='flex-row gap-4 items-center'>
                    <Trees className="h-10 w-10 text-primary" />
                    <div>
                        <CardTitle>{t('resultsCard.recommendedCrops.title')}</CardTitle>
                        <CardDescription>{t('resultsCard.recommendedCrops.description')}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {analysisResult.recommendedCrops.map((crop, index) => (
                            <li key={index} className="flex items-center gap-4 rounded-md bg-secondary/50 p-3">
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{crop.name}</p>
                                    <p className="text-sm text-muted-foreground">{t('resultsCard.recommendedCrops.marketRateLabel')}: <span className='font-bold text-foreground'>{crop.marketRate}</span></p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex-row gap-4 items-center'>
                    <FlaskConical className="h-10 w-10 text-accent" />
                    <div>
                        <CardTitle>{t('resultsCard.soilInfo.title')}</CardTitle>
                        <CardDescription>{t('resultsCard.soilInfo.description')}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground leading-relaxed">{analysisResult.soilInfo}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
