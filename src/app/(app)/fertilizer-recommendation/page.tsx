
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  recommendFertilizers,
  type RecommendFertilizersOutput,
} from '@/ai/flows/recommend-fertilizers';
import { fileToDataUri } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sprout } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';


const formSchema = z.object({
  cropType: z.string().min(3, "Please enter a valid crop type."),
  region: z.string().min(3, "Please enter a valid region."),
  soilReport: z.instanceof(File).refine((file) => file.size > 0, "Please upload your soil report."),
});

type FormValues = z.infer<typeof formSchema>;

export default function FertilizerRecommendationPage() {
  const [recommendation, setRecommendation] = useState<RecommendFertilizersOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('fertilizer-recommendation');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: '',
      region: '',
      soilReport: undefined,
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('soilReport', file);
    }
  };


  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setRecommendation(null);

    try {
      const dataUri = await fileToDataUri(data.soilReport);
      const result = await recommendFertilizers({ 
        cropType: data.cropType,
        region: data.region,
        soilReportDataUri: dataUri 
      });
      setRecommendation(result);
    } catch (error) {
      console.error('Error getting fertilizer recommendation:', error);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formCard.form.cropTypeLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('formCard.form.cropTypePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formCard.form.regionLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('formCard.form.regionPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="soilReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formCard.form.soilReportLabel')}</FormLabel>
                    <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.txt,.md,image/*"
                          onChange={handleFileChange}
                        />
                    </FormControl>
                     <FormDescription>{t('formCard.form.soilReportDescription')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('formCard.form.generatingButton')}
                  </>
                ) : (
                  t('formCard.form.getAdviceButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {recommendation && (
        <Card>
            <CardHeader className='flex-row gap-4 items-center'>
                <Sprout className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle>{t('recommendationCard.title')}</CardTitle>
                    <CardDescription>{t('recommendationCard.description')}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none text-foreground">
                    <p>{recommendation.fertilizerRecommendations}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
