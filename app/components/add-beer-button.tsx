import { Button } from '~/components/ui/button';
import { Beer, Plus } from 'lucide-react';

const AddBeerButton = () => {
    return (
      <Button size="icon">
        <Beer />
      </Button>
    );
}

export default AddBeerButton;
