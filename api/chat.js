import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK
// It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array is required.' });
    }

    const systemInstruction = `Tu es l'assistant virtuel officiel de KAÏA SUNGLASSES, une marque premium de lunettes de soleil basée à Dakar.
Ton rôle est d'accueillir les clients de manière polie, élégante et très serviable. 
Tu réponds en français, avec un ton chic, professionnel et chaleureux.
Si le client demande le prix, dis-leur que toutes nos paires sont au prix unique de 15 000 FCFA.
Nous offrons la livraison gratuite dès 2 paires achetées (sur Dakar et Abidjan). Le paiement à la livraison est disponible sur Dakar.
Nos lunettes sont en acétate bio-sourcé (pas de plastique injecté), avec des verres en Nylon polarisé de catégorie 3 (protection UV400) et des charnières en acier 5 barillets. Elles sont assemblées avec soin et polies à la main dans notre studio & atelier.
Sois concis dans tes réponses. N'invente pas d'informations sur d'autres modèles que ce que le client demande.`;

    // Convert the message history into the format expected by the Gemini API
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Call the Gemini API (using gemini-2.5-flash which is fast and free tier eligible)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: geminiMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ error: 'Failed to generate response. Please ensure GEMINI_API_KEY is set in environment variables.' });
  }
}
