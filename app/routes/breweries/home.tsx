import { Form, Link } from 'react-router';
import type { Route } from '../../../.react-router/types/app/routes/breweries/+types/home';
import { db } from '~/db';
import { Button } from '~/components/ui/button';
import { Card, CardDescription, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { breweries } from '~/db/schema';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export async function loader({ params }: Route.LoaderArgs) {
  const breweries = await db.query.breweries.findMany();
  return { breweries };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  await db.insert(breweries).values({ name, createdAt: new Date() });
}

export default function BreweriesHome({ loaderData }: Route.ComponentProps) {
  const { breweries } = loaderData;
  return (
    <div className="max-w-2xl mx-auto px-4 space-y-4">
      <h2 className="text-xl font-bold text-beer-dark">Getränkehersteller / Marken</h2>
      <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-x-scroll overflow-y-visible p-0.5 -m-0.5">
        {breweries.map((brewery) => (
          <Link to={`/breweries/${brewery.id}`} key={brewery.id}>
            <Card className="">
              <CardTitle>{brewery.name}</CardTitle>
              {brewery.createdAt && (
                <CardDescription>{format(brewery.createdAt, 'dd.MM.yy HH:mm')}</CardDescription>
              )}
            </Card>
          </Link>
        ))}
      </div>
      <Form method="post" action="/breweries">
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Neuer Getränkehersteller</Label>
            <Input name="name" placeholder="fritz Cola"/>
          </div>
          <Button type="submit" className="w-full">Speichern</Button>
        </Card>
      </Form>
      <Button variant="link" asChild className="absolute bottom-4 left-0 right-0">
        <Link to="/">
          <ArrowLeft />
          zurück
        </Link>
      </Button>
    </div>
  );
}
