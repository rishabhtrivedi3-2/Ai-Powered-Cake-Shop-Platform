'use server'; // This directive is crucial
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  // 1. Delete the session cookie
  (await cookies()).delete('session_token');

  // 2. Revalidate paths if necessary (optional)
  // revalidatePath('/'); 

  // 3. Redirect the user to login or home
  redirect('/login');
}
