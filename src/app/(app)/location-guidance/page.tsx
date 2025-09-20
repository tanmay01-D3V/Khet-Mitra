
'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trees, FlaskConical } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  soilTestResults: z.string().min(20, "Please provide detailed soil test results."),
  location: z.string().min(3, "Please provide your farm's location."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LocationGuidancePage() {
  const [analysisResult, setAnalysisResult] = useState<RecommendCropsBasedOnSoilAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('location-guidance');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilTestResults: '',
      location: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await recommendCropsBasedOnSoilAnalysis({
        soilTestResults: data.soilTestResults,
        location: data.location,
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formCard.form.locationLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('formCard.form.locationPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="soilTestResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formCard.form.soilTestResultsLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('formCard.form.soilTestResultsPlaceholder')}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
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
