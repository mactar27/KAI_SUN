import fetch from 'node-fetch';

async function main() {
  const loginRes = await fetch('https://www.kaiasun.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'kaia' }) // Try 'kaia' or 'admin'
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginData);

  if (loginData.token) {
    const res = await fetch('https://www.kaiasun.com/api/orders', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    const text = await res.text();
    console.log('GET orders status:', res.status);
    console.log('Body:', text.substring(0, 200));
  }
}
main();
