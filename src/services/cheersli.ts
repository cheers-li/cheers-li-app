import { Profile } from './friends';

export const sendCheersli = async (user: Profile, deviceToken: string[]) => {
  const baseUrl = import.meta.env.VITE_SUPABASE__FUNCTIONS_URL;
  const anon = import.meta.env.VITE_SUPABASE_KEY;

  const request = await fetch(`${baseUrl}/send-cheersli`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify({
      user,
      device_token: deviceToken,
    }),
  });

  console.log(request);
};