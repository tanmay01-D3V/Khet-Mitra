
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Languages, User as UserIcon, Upload, LocateFixed, Loader2, MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
import { fileToDataUri } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { getAddressFromCoordinates } from '@/ai/flows/get-address-from-coordinates-flow';

export default function ProfilePage() {
    const { user, updateProfilePhoto, updateUserLocation } = useAuth();
    const { toast } = useToast();
    const { t } = useTranslation('settings');

    const [imagePreview, setImagePreview] = useState<string | null>(user?.photo || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSavingPhoto, setIsSavingPhoto] = useState(false);
    
    const [location, setLocation] = useState(user?.location || '');
    const [isSavingLocation, setIsSavingLocation] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    useEffect(() => {
        if(user?.photo) setImagePreview(user.photo);
        if(user?.location) setLocation(user.location);
    }, [user]);

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
            await updateProfilePhoto(dataUri);
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
            setSelectedFile(null);
        }
    };
    
    const handleLocationSave = async () => {
        setIsSavingLocation(true);
        try {
            await updateUserLocation(location);
            toast({
                title: "Location Saved",
                description: "Your location has been updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not save your location. Please try again.",
                variant: 'destructive',
            });
        } finally {
            setIsSavingLocation(false);
        }
    }

    const handleFetchLocation = async () => {
        if (!navigator.geolocation) {
          toast({
            title: "Geolocation is not supported by your browser.",
            variant: "destructive",
          });
          return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const address = await getAddressFromCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setLocation(address);
            } catch (error) {
               toast({
                title: "Could not fetch address.",
                description: "Please enter your location manually.",
                variant: "destructive",
              });
            } finally {
                setIsFetchingLocation(false);
            }
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                <p className="text-muted-foreground">Manage your profile information.</p>
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
                            <MapPin className="h-6 w-6" />
                            Your Location
                        </CardTitle>
                        <CardDescription>
                            Set your primary farm location for tailored advice.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter your city or region" 
                            />
                            <Button type="button" variant="outline" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                                {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                                <span className="ml-2 hidden sm:inline">Fetch</span>
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleLocationSave} disabled={isSavingLocation}>
                            {isSavingLocation ? "Saving Location..." : "Save Location"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
