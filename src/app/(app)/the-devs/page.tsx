
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Code, Brush } from 'lucide-react';

export default function TheDevsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">The Devs</h1>
        <p className="text-muted-foreground">Meet the team behind Khet-Mitra.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
              <Users className="h-8 w-8 text-primary" />
              Back-End Development
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold font-headline">Saad Mulla</p>
            <p className="text-4xl font-bold font-headline">Daksh Srivastava</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
              <Brush className="h-8 w-8 text-primary" />
              Front-End Developer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold font-headline">Tanmay Sherkar</p>
          </CardContent>
        </Card>

        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            Made by{' '}
            <span className="font-headline text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-destructive">
              The Chefs
            </span>{' '}
            - with Spices 🔥👨‍🍳
          </p>
        </div>
      </div>
    </div>
  );
}
