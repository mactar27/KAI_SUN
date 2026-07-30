import fetch from 'node-fetch';
import 'dotenv/config';

async function main() {
  const res = await fetch('https://www.kaiasun.com/api/orders', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'KAIA_ADMIN_2026_SECRET'}`
    }
  });

  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', data);
}
main();
