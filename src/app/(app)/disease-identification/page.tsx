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


const formSchema = z.object({
  photo: z.instanceof(File).refine((file) => file.size > 0, "Please upload an image."),
});

type FormValues = z.infer<typeof formSchema>;

export default function DiseaseIdentificationPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCropDiseaseFromImageOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        title: 'Analysis Failed',
        description: 'There was an error analyzing the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-3xl font-bold tracking-tight">Disease Identification</h1>
          <p className="text-muted-foreground">Upload a photo of a crop to identify potential diseases.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Crop Image</CardTitle>
          <CardDescription>Select an image file of the affected crop from your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Photo</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                           {imagePreview ? (
                              <Image src={imagePreview} alt="Crop preview" layout="fill" objectFit="cover" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              {analysisResult.diseaseIdentification.diseaseDetected ? (
                  <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-destructive/10 rounded-lg">
                          <Siren className="h-8 w-8 text-destructive" />
                          <div>
                              <h3 className="font-bold text-lg text-destructive">Disease Detected</h3>
                              <p className="font-semibold text-xl">{analysisResult.diseaseIdentification.likelyDisease}</p>
                          </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                          <Card className="bg-secondary/50">
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
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
                                  <CardTitle className="text-sm font-medium">Suggested Actions</CardTitle>
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
                          <h3 className="font-bold text-lg text-primary">No Disease Detected</h3>
                          <p>The crop appears to be healthy based on the analysis.</p>
                      </div>
                  </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
