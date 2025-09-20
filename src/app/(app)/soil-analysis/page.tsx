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

const formSchema = z.object({
  soilTestResults: z.string().min(20, "Please provide detailed soil test results."),
  location: z.string().min(3, "Please provide your farm's location."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SoilAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<RecommendCropsBasedOnSoilAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        location: data.location
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing data:', error);
      toast({
        title: 'Analysis Failed',
        description: 'There was an error processing your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Soil Analysis & Crop Recommendation</h1>
        <p className="text-muted-foreground">Enter your soil data to get expert crop suggestions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Soil Data Input</CardTitle>
          <CardDescription>Provide your soil test results and location.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="soilTestResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Test Results</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., pH: 6.5, Nitrogen: 25ppm, Phosphorus: 50ppm, Potassium: 100ppm..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city or region" {...field} />
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
                  'Get Recommendations'
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
                        <CardTitle>Recommended Crops</CardTitle>
                        <CardDescription>Based on your data, these crops are highly suitable.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {analysisResult.recommendedCrops.map((crop, index) => (
                            <li key={index} className="flex items-center gap-4 rounded-md bg-secondary/50 p-3">
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{crop.name}</p>
                                    <p className="text-sm text-muted-foreground">Wholesale Rate: <span className='font-bold text-foreground'>{crop.marketRate}</span></p>
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
                        <CardTitle>Soil Information Summary</CardTitle>
                        <CardDescription>A summary of your soil's characteristics.</CardDescription>
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
