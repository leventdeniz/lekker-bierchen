import { Form, Link, redirect } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import type { Route } from '../../../.react-router/types/app/routes/drinks/+types/drink';
import { db } from '~/db';
import { drinking_logs, drinks } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft, Beer, Pencil } from 'lucide-react';
import { format } from 'date-fns';

export async function loader({ params }: Route.LoaderArgs) {
  const drink = await db.query.drinks.findFirst({
                                                  with: {
                                                    brewery: true,
                                                  },
                                                  where: eq(drinks.id, Number(params.id)),
                                                });
  const logs = await db.query.drinking_logs.findMany({
                                                       with: {
                                                         drink: true,
                                                         rating: true,
                                                       },
                                                       where: eq(drinking_logs.drink, Number(params.id)),
                                                     });
  return { drink, logs };
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
  const { drink, logs } = loaderData;
  if (!drink) {
    return (
      <div>Drink not found</div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        <h2 className="text-xl font-bold text-beer-dark">{`${drink.brewery?.name} ${drink.name}`}</h2>
        {logs.length > 0 && (
          <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-x-scroll overflow-y-visible p-0.5 -m-0.5">
            {logs.map((log) => (
              <Card className="">
                <CardTitle>{format(log.createdAt, 'dd.MM.yy HH:mm')}</CardTitle>
                {log.rating && (
                  <>
                    <CardDescription>Bitter: {log.rating.bitterness}</CardDescription>
                    <CardDescription>Säure: {log.rating.sourness}</CardDescription>
                    <CardDescription>Süße: {log.rating.sweetness}</CardDescription>
                    <CardDescription>Gesamt: {log.rating.overallRating}</CardDescription>
                    <CardDescription>Notitzen: {log.rating.notes}</CardDescription>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{`${drink.brewery?.name} ${drink.name}`}</CardTitle>
            {drink.updatedAt && (
              <CardDescription>{format(drink.updatedAt, 'dd.MM.yy HH:mm')}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div>Alk: {drink.alcoholPercentage} %</div>
            <div>Code: {drink.barcode}</div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="default" size="sm" asChild className="">
              <Link to={`/drinks/${drink.id}/edit`}>
                <Pencil />
                bearbeiten
              </Link>
            </Button>
            <Form method="post" action={`/drinks/${drink.id}/log` }>
              <Button type="submit" variant="default" size="sm" className="">
                <Beer />
                trinken
              </Button>
            </Form>
          </CardFooter>
        </Card>
        <Button variant="link" asChild className="w-full mt-4">
          <Link to="/drinks">
            <ArrowLeft/>
            zurück
          </Link>
        </Button>
      </div>
    </>
  );
}
