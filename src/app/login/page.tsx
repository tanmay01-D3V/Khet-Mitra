
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Camera } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { fileToDataUri } from '@/lib/utils';
import { extractAadhaarInfo, ExtractAadhaarInfoOutput } from '@/ai/flows/extract-aadhar-info-flow';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter a valid name.'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation('login');
  const { login } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      aadhaar: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setImagePreview(URL.createObjectURL(file));
      try {
        const dataUri = await fileToDataUri(file);
        const result = await extractAadhaarInfo({ photoDataUri: dataUri });
        if (result.name && result.aadhaarNumber) {
          form.setValue('name', result.name);
          form.setValue('aadhaar', result.aadhaarNumber.replace(/\s/g, ''));
           toast({
            title: t('scanSuccess.title'),
            description: t('scanSuccess.description'),
          });
        } else {
          throw new Error('Could not extract details.');
        }
      } catch (error) {
        console.error('Error scanning Aadhaar card:', error);
        toast({
          title: t('scanFailed.title'),
          description: t('scanFailed.description'),
          variant: 'destructive',
        });
      } finally {
        setIsScanning(false);
      }
    }
  };

  async function onSubmit(data: FormValues) {
    setIsLoggingIn(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    login({ name: data.name, aadhaar: data.aadhaar });
    toast({
        title: "Logged in successfully!",
    });
    router.push('/dashboard');
    setIsLoggingIn(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Image 
        id="login-bg"
        src="https://picsum.photos/seed/wheat/1920/1080" 
        alt="Wheat farm background" 
        data-ai-hint="wheat farm"
        fill
        priority
      />

      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo />
            </div>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.aadhaarLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.aadhaarPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/80 px-2 text-muted-foreground">{t('or')}</span>
                </div>
              </div>

              <div className='space-y-4'>
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                    {imagePreview ? (
                    <Image src={imagePreview} alt={t('form.aadhaarPreviewAlt')} layout="fill" objectFit="contain" />
                    ) : (
                    <div className="text-center text-muted-foreground">
                        <Camera className="mx-auto h-8 w-8" />
                        <p className="mt-2 text-sm">{t('form.scanPrompt')}</p>
                    </div>
                    )}
                    {isScanning && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        </div>
                    )}
                </div>

                <Button type="button" variant="outline" className="w-full relative">
                  <Upload className="mr-2 h-4 w-4" />
                  {t('form.scanButton')}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isScanning}
                  />
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoggingIn || isScanning}>
                 {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t('form.loginButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
