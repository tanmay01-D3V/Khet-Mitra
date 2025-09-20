
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeCropDiseaseFromImage,
  type AnalyzeCropDiseaseFromImageOutput,
} from '@/ai/flows/analyze-crop-disease-from-image';
import { fileToDataUri } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Leaf, Siren, ShieldCheck, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';


const formSchema = z.object({
  photo: z.instanceof(File).refine((file) => file.size > 0, "Please upload an image."),
});

type FormValues = z.infer<typeof formSchema>;

export default function DiseaseIdentificationPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCropDiseaseFromImageOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('disease-identification');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const dataUri = await fileToDataUri(data.photo);
      const result = await analyzeCropDiseaseFromImage({ photoDataUri: dataUri });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: t('toast.analysisFailed.title'),
        description: t('toast.analysisFailed.description'),
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
          <CardTitle>{t('uploadCard.title')}</CardTitle>
          <CardDescription>{t('uploadCard.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('uploadCard.form.photoLabel')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                           {imagePreview ? (
                              <Image src={imagePreview} alt={t('uploadCard.form.cropPreviewAlt')} layout="fill" objectFit="cover" />
                           ) : (
                              <Upload className="h-8 w-8 text-muted-foreground" />
                           )}
                        </div>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="max-w-xs"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('uploadCard.form.analyzingButton')}
                  </>
                ) : (
                  t('uploadCard.form.analyzeButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>{t('resultsCard.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              {analysisResult.diseaseIdentification.diseaseDetected ? (
                  <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-destructive/10 rounded-lg">
                          <Siren className="h-8 w-8 text-destructive" />
                          <div>
                              <h3 className="font-bold text-lg text-destructive">{t('resultsCard.diseaseDetected.title')}</h3>
                              <p className="font-semibold text-xl">{analysisResult.diseaseIdentification.likelyDisease}</p>
                          </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                          <Card className="bg-secondary/50">
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-sm font-medium">{t('resultsCard.diseaseDetected.confidenceLabel')}</CardTitle>
                                  <BarChart className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                  <div className="text-2xl font-bold">
                                      {Math.round(analysisResult.diseaseIdentification.confidenceLevel * 100)}%
                                  </div>
                                  <Progress value={analysisResult.diseaseIdentification.confidenceLevel * 100} className="mt-2 h-2" />
                              </CardContent>
                          </Card>
                          <Card className="bg-secondary/50">
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-sm font-medium">{t('resultsCard.diseaseDetected.actionsLabel')}</CardTitle>
                                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                  <p className="text-sm">{analysisResult.diseaseIdentification.suggestedActions}</p>
                              </CardContent>
                          </Card>
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                      <Leaf className="h-8 w-8 text-primary" />
                       <div>
                          <h3 className="font-bold text-lg text-primary">{t('resultsCard.noDiseaseDetected.title')}</h3>
                          <p>{t('resultsCard.noDiseaseDetected.description')}</p>
                      </div>
                  </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
