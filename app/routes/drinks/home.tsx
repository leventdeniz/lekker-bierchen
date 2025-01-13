import { Form, Link, redirect } from 'react-router';
import { Card, CardDescription, CardTitle } from '~/components/ui/card';
import { format } from 'date-fns';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import type { Route } from '../../../.react-router/types/app/routes/drinks/+types/home';
import { db } from '~/db';
import { breweries, drinks } from '~/db/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useState } from 'react';
import { ArrowLeft, Camera, Plus } from 'lucide-react';
import BarcodeScanner from '~/components/barcode-scanner';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

export async function loader({ params }: Route.LoaderArgs) {
  const drinks = await db.query.drinks.findMany({
                                                  with: {
                                                    brewery: true,
                                                  },
                                                });
  const breweries = await db.query.breweries.findMany();
  return { drinks, breweries };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const alcohol = formData.get('alcohol') as string;

  const barcodeString = formData.get('barcode');
  let barcode = null as number | null;
  if (barcodeString != null && !isNaN(Number(barcodeString))) {
    barcode = Number(barcodeString);
  }

  let breweryId = Number(formData.get('brewery'));
  if (isNaN(breweryId)) {
    const ids = await db.insert(breweries)
                        .values({ name: formData.get('brewery') as string, createdAt: new Date() })
                        .$returningId();
    breweryId = ids[0].id;
  }

  await db.insert(drinks).values({
                                   name,
                                   barcode,
                                   brewery: breweryId,
                                   alcoholPercentage: alcohol,
                                   createdAt: new Date(),
                                   updatedAt: new Date(),
                                 });
  return redirect('/drinks?created=true');
}

export default function DrinksHome({ loaderData }: Route.ComponentProps) {
  const [createNewBrewery, setCreateNewBrewery] = useState(false);
  const [alcohol, setAlcohol] = useState('0');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [barcode, setBarcode] = useState<number | null>(null);
  const toggleCreateNewBrewery = () => setCreateNewBrewery((prev) => !prev);

  const { drinks, breweries } = loaderData;
  return (
    <div className="max-w-2xl mx-auto px-4 space-y-4">
      <h2 className="text-xl font-bold text-beer-dark">Getränke</h2>
      <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-x-scroll overflow-y-visible p-0.5 -m-0.5">
        {drinks.map((drink) => (
          <Link to={`/drinks/${drink.id}`} key={drink.id}>
            <Card className="">
              {drink.brewery && (
                <CardDescription>{drink.brewery.name}</CardDescription>
              )}
              <CardTitle>{drink.name}</CardTitle>
              {drink.updatedAt && (
                <CardDescription>{format(drink.updatedAt, 'dd.MM.yy HH:mm')}</CardDescription>
              )}
            </Card>
          </Link>
        ))}
      </div>
      <Form method="post" action="/drinks">
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
               <Select name="brewery">
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
            <Input name="name" placeholder="Alkoholfreies"/>
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
                  <Button size="icon" asChild  variant="secondary">
                   <div>
                     <Camera/>
                   </div>
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
        <Link to="/">
          <ArrowLeft/>
          zurück
        </Link>
      </Button>
    </div>
  );
}
