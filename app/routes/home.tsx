import type { Route } from './+types/home';
import AddBeerButton from '~/components/add-beer-button';
import BarcodeScanner from '~/components/barcode-scanner';
import RecentDrinksList from '~/components/recent-drinks-list';
import { db } from '~/db';
import { Link, redirect } from 'react-router';
import { Button } from '~/components/ui/button';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const drinks = await db.query.drinks.findMany({
    with: {
      brewery: true,
    },
  });
  const logs = await db.query.drinking_logs.findMany({
    with: {
     drink: {
       with: {
         brewery: true,
       }
     },
     rating: true,
    },
    limit: 5,
 });

  console.log({ drinks });
  return { drinks, logs };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { logs, drinks } = loaderData;

  const onBarcode = (barcode: string) => {
    const drink = drinks.find((d) => d.barcode === Number(barcode));
    if (drink) {
      redirect(`/drinks/${drink.id}`);
    } else {
      redirect(`/drinks/new?barcode=${barcode}`);
    }
  };
  return (
    <div>
      <RecentDrinksList logs={logs}/>
      <BarcodeScanner callbackFn={onBarcode}/>
      <div className="absolute bottom-6 right-6">
        <AddBeerButton/>
      </div>
      <Button variant="link" asChild>
        <Link to="/breweries">
          Getränkehersteller
        </Link>
      </Button>
      <Button variant="link" asChild>
        <Link to="/drinks">
          Getränke
        </Link>
      </Button>
    </div>
  );
};
