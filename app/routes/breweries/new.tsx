import { Form, redirect } from 'react-router';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import type { Route } from '../../../.react-router/types/app/routes/breweries/+types/new';
import { db } from '~/db';
import { breweries } from '~/db/schema';

  export async function action({
   request,
  }: Route.ActionArgs) {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    await db.insert(breweries).values({ name, createdAt: new Date() });
    return redirect('/');
  }

export default function BreweriesNew() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1>New Brewery</h1>
      <Form method="post">
        <Card className="p-6 space-y-6 bg-beer-cream/50 backdrop-blur-sm">
          <div className="space-y-2">
            <Label htmlFor="name">Getränkehersteller Name</Label>
            <Input name="name" placeholder="fritz Cola"/>
          </div>
          <Button type="submit" className="w-full">Speichern</Button>
        </Card>
      </Form>
    </div>
  );
}
