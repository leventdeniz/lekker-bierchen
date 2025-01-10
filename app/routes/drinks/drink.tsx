import { Form, Link, redirect } from 'react-router';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import type { Route } from '../../../.react-router/types/app/routes/drinks/+types/drink';
import { db } from '~/db';
import { breweries, drinks } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft, ChevronLeft, Plus, Trash, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useState } from 'react';

export async function loader({ params }: Route.LoaderArgs) {
  const drink = await db.select().from(drinks).where(eq(drinks.id, Number(params.id))).limit(1);
  const breweries = await db.query.breweries.findMany();
  return { drink: drink[0], breweries };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'delete') {
    await db.delete(drinks).where(eq(drinks.id, Number(params.id)));
    return redirect('/drinks');
  }

  const name = formData.get('name') as string;
  await db.update(drinks).set({ name }).where(eq(drinks.id, Number(params.id)));
  return redirect('/drinks');
}

export default function DrinksDrink({ loaderData }: Route.ComponentProps) {
  const [createNewBrewery, setCreateNewBrewery] = useState(false);
  const [alcohol, setAlcohol] = useState('0');
  const toggleCreateNewBrewery = () => setCreateNewBrewery((prev) => !prev);

  const { drink, breweries } = loaderData;
  return (
    <>
      <Form method="post" action="/drinks" className="flex flex-col max-w-2xl mx-auto px-4 gap-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-beer-dark">{drink.name}</h2>
          <Button
            type="submit"
            name="intent"
            value="delete"
            size="sm"
            variant="destructive"
          >
            <Trash2 size={24}/>
          </Button>
        </div>
        <Card className="p-4 space-y-4">
          <h3 className="font-bold">Neues Getränk</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="brewery">Herrsteller</Label>
              <Button onClick={toggleCreateNewBrewery} size="xs" variant="secondary" className="p-1">
                <Plus size={12}/>
                neu &nbsp;
              </Button>
            </div>
            {createNewBrewery ? (
              <Input name="brewery" placeholder="fritz Cola"/>
            ) : (
               <Select name="brewery" defaultValue={`${drink.brewery}`}>
                 <SelectTrigger>
                   <SelectValue placeholder="Wähle einen Hersteller"/>
                 </SelectTrigger>
                 <SelectContent>
                   {breweries.map((brewery) => (
                     <SelectItem value={`${brewery.id}`} key={brewery.id}>{brewery.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input name="name" placeholder="Alkoholfreies" defaultValue={drink.name}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input name="barcode" type="number" placeholder="123123123" defaultValue={`${drink.barcode}`}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alcohol">alc%</Label>
            <div className="flex flex-row gap-2">
              <Input name="alcohol" value={alcohol} onChange={(e) => setAlcohol(e.target.value)} type="number" placeholder="0.0"/>
              <Button variant="secondary" onClick={() => setAlcohol('0')}>0.0%</Button>
              <Button variant="secondary" onClick={() => setAlcohol('0.1')}>{'<0.5%'}</Button>
            </div>
          </div>

          <Button type="submit" className="w-full">Speichern</Button>
        </Card>
      </Form>

      <Button variant="link" asChild className="w-full mt-4">
        <Link to="/drinks">
          <ArrowLeft/>
          zurück
        </Link>
      </Button>
    </>
  );
}
