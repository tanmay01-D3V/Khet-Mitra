
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Languages } from 'lucide-react';

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
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        setIsSaving(true);
        // Simulate saving the preference
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: 'Settings Saved',
                description: `Language preference updated to ${indianLanguages.find(l => l.value === selectedLanguage)?.label}.`,
            });
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your application preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-6 w-6" />
                        Language Settings
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred language for the application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="language-select" className="text-sm font-medium">
                            Application Language
                        </label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger id="language-select" className="w-full md:w-1/2">
                                <SelectValue placeholder="Select a language" />
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
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
