import fetch from 'node-fetch';

async function main() {
  const payload = {
    deliveryInfo: {
      prenom: 'Test',
      nom: 'Prod',
      adresse: 'Test',
      phone: '1234',
      ville: 'Dakar'
    },
    items: [
      { product: { id: 'NDL8298', price: 12500, costPrice: 5000 }, quantity: 1 }
    ],
    total: 10000
  };

  const res = await fetch('https://www.kaiasun.com/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', data);
}
main();
