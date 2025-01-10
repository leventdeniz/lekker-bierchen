import type { DrinkingLogType, DrinkType, RatingType } from '~/db/schema';
import { Card } from '~/components/ui/card';

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




const RecentDrinksList = ({ logs }) => {
  console.log({ logs });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-4">
      {mockDrinkLog.map((log) => (
        <Card key={log.id} className="p-6 bg-beer-cream/50 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-beer-dark">{log.drink.name}</h3>
              <p className="text-beer-brown">{log.drink.brewery}</p>
            </div>

            <div className="text-sm text-beer-brown">
              <p>ABV: {log.drink.alcoholPercentage}%</p>
            </div>
            {log.rating && (
              <div className="space-y-2">
                <h4 className="font-medium text-beer-dark">Ratings</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>Sweetness: {log.rating.sweetness}/5</p>
                  <p>Bitterness: {log.rating.bitterness}/5</p>
                  <p>Sourness: {log.rating.sourness}/5</p>
                  <p>Overall: {log.rating.overallRating}/5</p>
                </div>
                {log.rating.notes && (
                  <p className="text-sm italic">"{log.rating.notes}"</p>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecentDrinksList;
