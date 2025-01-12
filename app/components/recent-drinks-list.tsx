import type { BreweryType, DrinkingLogType, DrinkType, RatingType } from '~/db/schema';
import { Card, CardDescription, CardTitle } from '~/components/ui/card';
import { format } from 'date-fns';
import type { Route } from '../../.react-router/types/app/routes/+types/home';

const mockDrinkLog: (Omit<DrinkingLogType, 'rating' | 'drink'> & { rating?: RatingType; drink: DrinkType })[] = [
  {
    id: 1,
    drink: {
      id: 1,
      barcode: 123456789,
      name: 'IPA',
      brewery: 1,
      alcoholPercentage: '6.5',
      createdAt: new Date(),
      updatedAt: new Date(),
      labelPhoto: null,
    },
    rating: {
      id: 1,
      drink: 1,
      sweetness: 3,
      bitterness: 4,
      sourness: 2,
      overallRating: 4,
      notes: 'A delightful IPA with citrus notes',
    },
    createdAt: new Date(),
  },
];


type RecentDrinksListProps = {
  logs: Route.ComponentProps['loaderData']['logs'];
}

const RecentDrinksList = ({ logs }: RecentDrinksListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-4">
      {logs.length > 0 && (
        <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-x-scroll overflow-y-visible p-0.5 -m-0.5">
          {logs.map((log) => (
            <Card className="">
              <CardTitle>{format(log.createdAt, 'dd.MM.yy HH:mm')}</CardTitle>
              <CardDescription>{`${log.drink.brewery?.name} ${log.drink.name}`}</CardDescription>
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
    </div>
  );
};

export default RecentDrinksList;
