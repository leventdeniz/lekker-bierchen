import type { Route } from './+types/home';
import AddBeerButton from '~/components/add-beer-button';
import BarcodeScanner from '~/components/barcode-scanner';
import RecentDrinksList from '~/components/recent-drinks-list';
import { db } from '~/db';
import { breweries, drinks } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // const logs = await db.select()
  //                      .from(drinks)
  //                      .leftJoin(breweries, eq(drinks.brewery, breweries.id))
  //                      .orderBy(drinks.createdAt)
  //                      .limit(10);
  const drinks = await db.query.drinks.findMany({
    with: {
      brewery: true,
    }
  });
  const logs = await db.query.drinking_logs.findMany({
                                                       with: {
                                                         drink: true,
                                                         rating: true,
                                                       },
                                                     });
  console.log({ drinks });
  return { drinks, logs };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { logs,drinks } = loaderData;
  return (
    <div>
      <div>drinks:</div>
      <pre>{JSON.stringify(drinks, null, 2)}</pre>
      <div>logs:</div>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
      <RecentDrinksList logs={logs}/>
      <BarcodeScanner />
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
}
