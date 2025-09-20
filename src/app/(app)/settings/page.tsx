
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Languages, User as UserIcon, Upload } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
import { fileToDataUri } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

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
    const { user, updateProfilePhoto } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation('settings');

    const [imagePreview, setImagePreview] = useState<string | null>(user?.photo || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSavingPhoto, setIsSavingPhoto] = useState(false);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoSave = async () => {
        if (!selectedFile) return;
        setIsSavingPhoto(true);
        try {
            const dataUri = await fileToDataUri(selectedFile);
            updateProfilePhoto(dataUri);
            toast({
                title: "Profile Photo Updated",
                description: "Your new photo has been saved.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not save the new photo. Please try again.",
                variant: 'destructive',
            });
        } finally {
            setIsSavingPhoto(false);
        }
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
                            <UserIcon className="h-6 w-6" />
                            Profile Photo
                        </CardTitle>
                        <CardDescription>
                            Update your profile picture.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={imagePreview || `https://avatar.vercel.sh/${user?.name}.png`} />
                                <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="relative">
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload New Photo
                                </Button>
                                <Input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                         <Button onClick={handlePhotoSave} disabled={isSavingPhoto || !selectedFile}>
                            {isSavingPhoto ? "Saving Photo..." : "Save Photo"}
                        </Button>
                    </CardFooter>
                </Card>

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
