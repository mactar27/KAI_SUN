import fetch from 'node-fetch';

async function main() {
  const res = await fetch('https://www.kaiasun.com/api/orders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', data);
}
main();
