import { Form, Link, redirect } from 'react-router';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import type { Route } from '../../../.react-router/types/app/routes/breweries/+types/brewery';
import { db } from '~/db';
import { breweries } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft, ChevronLeft, Trash, Trash2 } from 'lucide-react';

export async function loader({ params }: Route.LoaderArgs) {
  const brewery = await db.select().from(breweries).where(eq(breweries.id, Number(params.id))).limit(1);
  return { brewery: brewery[0] };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'delete') {
    await db.delete(breweries).where(eq(breweries.id, Number(params.id)));
    return redirect('/breweries');
  }

  const name = formData.get('name') as string;
  await db.update(breweries).set({ name }).where(eq(breweries.id, Number(params.id)));
  return redirect('/breweries');
}

export default function BreweriesBrewery({ loaderData }: Route.ComponentProps) {
  const { brewery } = loaderData;
  return (
    <>
      <Form
        method="post"
        className="flex flex-col max-w-2xl mx-auto px-4 gap-4"
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-beer-dark">{brewery.name}</h2>
          <Button
            type="submit"
            name="intent"
            value="delete"
            size="sm"
            variant="destructive"
            onClick={(e) => confirm(`Getränkehersteller ${brewery.name} wirklich löchen?`) ? true : e.preventDefault()}
          >
            <Trash2 size={24}/>
          </Button>
        </div>
        <Card className="p-6 space-y-6 bg-beer-cream/50 backdrop-blur-sm">
          <div className="space-y-2">
            <Label htmlFor="name">Getränkehersteller Name</Label>
            <Input defaultValue={brewery.name} name="name" placeholder="fritz Cola"/>
          </div>
          <Button
            type="submit"
            name="intent"
            value="update"
            className="w-full"
          >
            Aktualisieren
          </Button>
        </Card>
      </Form>
      <Button variant="link" asChild className="absolute bottom-4 left-0 right-0">
        <Link to="/breweries">
          <ArrowLeft />
          zurück
        </Link>
      </Button>
    </>
  );
}
