import { useState } from 'react';
import { Form, Link, redirect } from 'react-router';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import type { Route } from '../../../.react-router/types/app/routes/drinks/+types/edit';
import { db } from '~/db';
import { eq } from 'drizzle-orm';
import { drinking_logs, drinks } from '~/db/schema';
import { ArrowLeft, Camera, ChevronLeft, Plus, Trash, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import BarcodeScanner from '~/components/barcode-scanner';


export async function loader({ params }: Route.LoaderArgs) {
  const drink = await db.query.drinks.findFirst({
                                                  with: {
                                                    brewery: true,
                                                  },
                                                  where: eq(drinks.id, Number(params.id)),
                                                });
  const breweries = await db.query.breweries.findMany();
  const logs = await db.query.drinking_logs.findMany({
                                                       with: {
                                                         drink: true,
                                                       },
                                                       where: eq(drinking_logs.drink, Number(params.id)),
                                                     });
  return { drink, breweries, logs };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'delete') {
    await db.delete(drinks).where(eq(drinks.id, Number(params.id)));
    return redirect(`/drinks/${params.id}`);
  }

  const name = formData.get('name') as string;
  await db.update(drinks).set({ name }).where(eq(drinks.id, Number(params.id)));
  return redirect(`/drinks/${params.id}`);
}

export default function DrinkEdit ({ loaderData }: Route.ComponentProps) {
  const [createNewBrewery, setCreateNewBrewery] = useState(false);
  const [alcohol, setAlcohol] = useState('0');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [barcode, setBarcode] = useState<number | null>(null);
  const toggleCreateNewBrewery = () => setCreateNewBrewery((prev) => !prev);

  const { drink, breweries, logs } = loaderData;
  if (!drink) {
    return (
      <div>Drink not found</div>
    );
  }


  return (
    <>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
      <Form method="post" className="flex flex-col max-w-2xl mx-auto px-4 gap-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-beer-dark">{`${drink.brewery?.name} ${drink.name}`}</h2>
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
               <Select name="brewery" defaultValue={drink.brewery ? `${drink.brewery.id}` : undefined}>
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
            <div className="flex flex-row gap-2">
              <Input
                name="barcode"
                type="number"
                value={barcode ? `${barcode}` : undefined}
                placeholder="123123123"
                onChange={(e) => setBarcode(Number(e.target.value))}
              />
              <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
                <DialogTrigger>
                  <Button size="icon" variant="secondary">
                    <Camera/>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <BarcodeScanner callbackFn={(result) => {
                    setBarcode(Number(result));
                    setShowBarcodeScanner(false);
                  }}/>
                </DialogContent>
              </Dialog>
            </div>
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
        <Link to={'/drinks/' + drink.id}>
          <ArrowLeft/>
          zurück
        </Link>
      </Button>
    </>
  );
}


