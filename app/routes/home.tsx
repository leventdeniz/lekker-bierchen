import type { Route } from './+types/home';
import { Welcome } from '~/components/welcome/welcome';
import AddBeerButton from '~/components/add-beer-button';
import BarcodeScanner from '~/components/barcode-scanner';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div>
      <BarcodeScanner/>
      <div className="absolute bottom-6 right-6">
        <AddBeerButton/>
      </div>
    </div>

  );
}
