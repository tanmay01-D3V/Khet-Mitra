
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Languages, Star, Heart, LifeBuoy } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

const indianLanguages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi (हिन्दी)' },
    { value: 'bn', label: 'Bengali (বাংলা)' },
    { value: 'te', label: 'Telugu (తెలుగు)' },
    { value: 'mr', label: 'Marathi (मराठी)' },
    { value: 'ta', label: 'Tamil (தமிழ்)' },
    { value: 'ur', label: 'Urdu (اردو)' },
    { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
    { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
    { value: 'or', label: 'Odia (ଓଡ଼ିଆ)' },
    { value: 'ml', label: 'Malayalam (മലയാളം)' },
    { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { value: 'as', label: 'Assamese (অসমীয়া)' },
];

export default function SettingsPage() {
    const { language, setLanguage } = useLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation('settings');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleLanguageSave = () => {
        setIsSaving(true);
        setLanguage(selectedLanguage);
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: t('toast.saved.title'),
                description: t('toast.saved.description', { language: indianLanguages.find(l => l.value === selectedLanguage)?.label }),
            });
        }, 1000);
    };

    const handleRatingSubmit = () => {
        if (rating === 0) {
            toast({
                title: "Please select a rating",
                variant: "destructive",
            });
            return;
        }
        toast({
            title: "Thank you for your feedback!",
            description: `You rated us ${rating} out of 5 stars.`,
        });
    };
    
    const handleDonation = () => {
        toast({
            title: "Thank you for your support!",
            description: "Your generosity helps us keep KhetMitr running.",
        });
    }

    const handleSupport = () => {
        toast({
            title: "Support Request",
            description: "We've received your request. Our team will get back to you shortly.",
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Languages className="h-6 w-6" />
                            {t('languageCard.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('languageCard.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="language-select" className="text-sm font-medium">
                                {t('languageCard.form.label')}
                            </label>
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                <SelectTrigger id="language-select" className="w-full">
                                    <SelectValue placeholder={t('languageCard.form.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {indianLanguages.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleLanguageSave} disabled={isSaving}>
                            {isSaving ? t('languageCard.form.savingButton') : t('languageCard.form.saveButton')}
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LifeBuoy className="h-6 w-6" />
                            {t('supportCard.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('supportCard.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>{t('supportCard.content')}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSupport}>
                            {t('supportCard.contactButton')}
                        </Button>
                    </CardFooter>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-6 w-6" />
                            {t('reviewCard.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('reviewCard.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center space-x-2">
                       {[1, 2, 3, 4, 5].map((star) => (
                           <Star
                                key={star}
                                className={cn(
                                    "h-10 w-10 cursor-pointer transition-colors",
                                    (hoverRating >= star || rating >= star) 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-muted-foreground"
                                )}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                           />
                       ))}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleRatingSubmit}>{t('reviewCard.submitButton')}</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-red-500" />
                            {t('donationCard.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('donationCard.description')}
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className='text-sm text-muted-foreground'>{t('donationCard.content')}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleDonation}>
                            {t('donationCard.donateButton')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
