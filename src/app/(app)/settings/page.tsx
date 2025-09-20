
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useTranslation } from '@/hooks/use-translation';

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


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
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
            </div>
        </div>
    );
}
