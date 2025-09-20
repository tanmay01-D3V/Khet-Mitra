
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Signal, Wifi, WifiOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';

type DeviceStatus = 'connecting' | 'online' | 'offline';

const initialSoilData = {
  ph: 7.0,
  nitrogen: 30,
  phosphorus: 60,
  potassium: 120,
  moisture: 45,
};

export default function MyPollPage() {
  const [status, setStatus] = useState<DeviceStatus>('connecting');
  const [soilData, setSoilData] = useState(initialSoilData);
  const { t } = useTranslation('my-poll');

  useEffect(() => {
    // Simulate initial connection attempt
    const connectionTimeout = setTimeout(() => {
      // Randomly succeed or fail connection for demo purposes
      if (Math.random() > 0.3) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    }, 3000);

    return () => clearTimeout(connectionTimeout);
  }, []);

  useEffect(() => {
    if (status !== 'online') return;

    // Simulate real-time data updates every 5 seconds
    const dataInterval = setInterval(() => {
      setSoilData((prevData) => ({
        ph: parseFloat((prevData.ph + (Math.random() - 0.5) * 0.2).toFixed(1)),
        nitrogen: Math.max(0, Math.min(100, prevData.nitrogen + Math.floor((Math.random() - 0.5) * 4))),
        phosphorus: Math.max(0, Math.min(150, prevData.phosphorus + Math.floor((Math.random() - 0.5) * 6))),
        potassium: Math.max(0, Math.min(200, prevData.potassium + Math.floor((Math.random() - 0.5) * 8))),
        moisture: Math.max(0, Math.min(100, prevData.moisture + Math.floor((Math.random() - 0.45) * 5))),
      }));
    }, 5000);

    return () => clearInterval(dataInterval);
  }, [status]);
  
  const getStatusIndicator = () => {
    switch (status) {
      case 'connecting':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'online':
        return <Wifi className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader className='flex-row items-center justify-between'>
            <div>
                <CardTitle>{t('deviceStatusCard.title')}</CardTitle>
                <CardDescription>{t('deviceStatusCard.description')}</CardDescription>
            </div>
            <div className='flex items-center gap-2'>
                {getStatusIndicator()}
                <Badge variant={status === 'online' ? 'default' : status === 'offline' ? 'destructive' : 'secondary'} className="capitalize">
                    {t(`deviceStatusCard.status.${status}`)}
                </Badge>
            </div>
        </CardHeader>
      </Card>
      
      {status === 'online' ? (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                    <Signal className="h-6 w-6" />
                    {t('liveDataCard.title')}
                </CardTitle>
                <CardDescription>
                    {t('liveDataCard.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <DataCard title={t('liveDataCard.phLevel')} value={soilData.ph.toFixed(1)} unit="" />
                <DataCard title={t('liveDataCard.nitrogen')} value={soilData.nitrogen} unit="ppm" />
                <DataCard title={t('liveDataCard.phosphorus')} value={soilData.phosphorus} unit="ppm" />
                <DataCard title={t('liveDataCard.potassium')} value={soilData.potassium} unit="ppm" />
                <DataCard title={t('liveDataCard.soilMoisture')} value={soilData.moisture} unit="%" progress={soilData.moisture} />
            </CardContent>
        </Card>
      ) : status === 'connecting' ? (
         <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <CardTitle>{t('connectingCard.title')}</CardTitle>
            <CardDescription>{t('connectingCard.description')}</CardDescription>
         </Card>
      ) : (
         <Card className="flex flex-col items-center justify-center p-12 text-center bg-destructive/10">
            <WifiOff className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-destructive">{t('offlineCard.title')}</CardTitle>
            <CardDescription>
                {t('offlineCard.description')}
            </CardDescription>
         </Card>
      )}

    </div>
  );
}

function DataCard({ title, value, unit, progress }: { title: string, value: number | string, unit: string, progress?: number }) {
    return (
        <Card className='bg-secondary/50'>
            <CardHeader className='pb-2'>
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold tracking-tighter">
                    {value}<span className="text-2xl text-muted-foreground ml-1">{unit}</span>
                </div>
                {progress !== undefined && <Progress value={progress} className="mt-2 h-2" />}
            </CardContent>
        </Card>
    );
}
