
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getWeatherForecast,
  type GetWeatherForecastOutput,
} from '@/ai/flows/get-weather-forecast-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LocateFixed, Sun, Cloud, CloudRain, Wind } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  location: z.string().min(3, "Please provide your farm's location."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LocationGuidancePage() {
  const [weatherResult, setWeatherResult] = useState<GetWeatherForecastOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('location-guidance');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
    },
  });

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsFetchingLocation(false);
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
    setWeatherResult(null);

    try {
      const result = await getWeatherForecast({ location: data.location });
      setWeatherResult(result);
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: t('toast.failed.title'),
        description: t('toast.failed.description'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const getWeatherIcon = (condition: string) => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('rain')) return <CloudRain className="h-10 w-10 text-blue-500" />;
    if (lowerCaseCondition.includes('cloud')) return <Cloud className="h-10 w-10 text-gray-500" />;
    if (lowerCaseCondition.includes('wind')) return <Wind className="h-10 w-10 text-gray-400" />;
    if (lowerCaseCondition.includes('sun')) return <Sun className="h-10 w-10 text-yellow-500" />;
    return <Sun className="h-10 w-10 text-yellow-500" />;
  };


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
                    {t('formCard.form.fetchingButton')}
                  </>
                ) : (
                  t('formCard.form.getForecastButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {weatherResult && (
        <Card>
            <CardHeader>
                <CardTitle>{t('resultsCard.title', { location: form.getValues('location') })}</CardTitle>
                <CardDescription>{t('resultsCard.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weatherResult.forecast.map((day, index) => (
                        <Card key={index} className="flex flex-col items-center justify-center p-4 text-center bg-secondary/50">
                           <p className="font-bold text-lg">{day.day}</p>
                           <div className="my-2">
                            {getWeatherIcon(day.condition)}
                           </div>
                           <p className="font-semibold text-xl">{day.temperature}</p>
                           <p className="text-sm text-muted-foreground">{day.condition}</p>
                           <p className="text-xs text-muted-foreground mt-1">Humidity: {day.humidity}</p>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
