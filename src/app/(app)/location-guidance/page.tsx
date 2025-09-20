'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, LocateFixed, AlertTriangle, Trees, FlaskConical } from 'lucide-react';

const formSchema = z.object({
  soilTestResults: z.string().min(20, "Please provide detailed soil test results."),
  location: z.string().min(3, "Please provide your farm's location."),
  climaticConditions: z.string().min(10, "Please describe the climatic conditions."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LocationGuidancePage() {
  const [analysisResult, setAnalysisResult] = useState<RecommendCropsBasedOnSoilAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilTestResults: '',
      location: '',
      climaticConditions: '',
    },
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
        form.setValue('location', locationString);
        setIsLocating(false);
        toast({
            title: "Location Fetched",
            description: `Your location has been set to: ${locationString}`,
        })
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsLocating(false);
      }
    );
  };
  
  useEffect(() => {
    // Automatically fetch location on component mount
    getLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <h1 className="text-3xl font-bold tracking-tight">Location-Based Guidance</h1>
        <p className="text-muted-foreground">Use your location to get tailored crop advice.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crop Recommendation Form</CardTitle>
          <CardDescription>We've fetched your location. Now, please provide your soil and climate details for accurate recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-grow w-full">
                        <FormLabel>Your Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Click 'Fetch Location' or enter manually" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" onClick={getLocation} disabled={isLocating} className="w-full sm:w-auto mt-2 sm:mt-8">
                      {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LocateFixed className="mr-2 h-4 w-4"/>}
                      Fetch Location
                  </Button>
              </div>
              {locationError && <p className="text-sm font-medium text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {locationError}</p>}
              
              <FormField
                control={form.control}
                name="climaticConditions"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Climatic Conditions</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Tropical, dry winters, average 1500mm rainfall" {...field} />
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
                    <FormLabel>Soil Test Results</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., pH: 6.5, Nitrogen: 25ppm, Phosphorus: 50ppm..."
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
                        <CardDescription>Suitable crops for your location and soil.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                      {analysisResult.recommendedCrops.map((crop, index) => (
                          <li key={index} className="flex items-center gap-4 rounded-md bg-secondary/50 p-3">
                              <Image src={crop.imageUrl} alt={crop.name} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
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
