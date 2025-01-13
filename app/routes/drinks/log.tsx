import type { Route } from '../../../.react-router/types/app/routes/drinks/+types/log';
import { db } from '~/db';
import { drinking_logs, drinks } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'react-router';

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  if (request.method === 'DELETE') {
    await db.delete(drinking_logs).where(eq(drinking_logs.id, Number(params.id)));
    return redirect(`/drinks/${params.drink}`);
  }

  await db.insert(drinking_logs).values({
    createdAt: new Date(),
    drink: Number(params.id),
  });
  return redirect(`/drinks/${params.id}`);
}
export default function DrinkLog() {
  return (
    <div>
      <h1>Drink Log</h1>
    </div>
  );
}
