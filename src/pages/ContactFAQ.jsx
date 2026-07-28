import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Pour les commandes à Dakar, la livraison s'effectue généralement sous 24 à 48 heures ouvrées. Pour les autres régions, le délai peut varier de 3 à 5 jours ouvrés."
  },
  {
    question: "Faites-vous des livraisons internationales ?",
    answer: "Nous expédions principalement au Sénégal (Dakar) pour le moment, mais nous pouvons organiser des livraisons vers la Côte d'Ivoire (Abidjan) sur demande spéciale. Contactez-nous pour plus d'informations."
  },
  {
    question: "Puis-je retourner ma monture si elle ne me va pas ?",
    answer: "Oui, vous disposez d'un délai de 14 jours après réception pour nous retourner votre commande. La monture doit être dans son état d'origine, non portée, avec tous ses accessoires. Les frais de retour sont à votre charge."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Actuellement, nous privilégions le paiement à la livraison (en espèces) pour les clients de Dakar. D'autres solutions de type Mobile Money (Wave, Orange Money) seront très prochainement disponibles."
  },
  {
    question: "Les verres offrent-ils une protection UV totale ?",
    answer: "Absolument. Toutes nos lunettes de soleil sont équipées de verres certifiés UV400, garantissant une protection à 100% contre les rayons UVA et UVB, idéals pour la forte luminosité de Dakar."
  }
];

const ContactFAQ = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Merci pour votre message ! Notre équipe vous répondra dans les plus brefs délais.");
    e.target.reset();
  };

  return (
    <div style={{ background: 'var(--kaia-cream)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', color: '#111' }}>
      <div className="wrap">
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '16px', color: '#0d2823', textAlign: 'center' }}>
          Contact & FAQ
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '60px', fontSize: '1.1rem' }}>
          Une question ? Besoin d'aide pour choisir votre monture ? Nous sommes là.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          
          {/* Section Contact */}
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', fontFamily: "'Playfair Display', Georgia, serif", color: '#0d2823' }}>Nous Contacter</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} color="#cba75c" />
                <a href="mailto:contact@kaiasun.com" style={{ color: '#111', textDecoration: 'none' }}>contact@kaiasun.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={20} color="#cba75c" />
                <a href="tel:+221770000000" style={{ color: '#111', textDecoration: 'none' }}>+221 77 000 00 00 (WhatsApp)</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={20} color="#cba75c" />
                <span>Dakar, Sénégal</span>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Nom complet</label>
                <input type="text" id="name" required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', fontSize: '1rem' }} />
              </div>
              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Adresse email</label>
                <input type="email" id="email" required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', fontSize: '1rem' }} />
              </div>
              <div>
                <label htmlFor="subject" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Sujet</label>
                <input type="text" id="subject" required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', fontSize: '1rem' }} />
              </div>
              <div>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Message</label>
                <textarea id="message" required rows="5" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', fontSize: '1rem', resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" style={{ background: '#0d2823', color: '#fff', padding: '14px', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = '#154038'} onMouseLeave={(e) => e.target.style.background = '#0d2823'}>
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Section FAQ */}
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', fontFamily: "'Playfair Display', Georgia, serif", color: '#0d2823' }}>Questions Fréquentes (FAQ)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '1rem', color: '#111' }}
                  >
                    {faq.question}
                    {openFaqIndex === index ? <ChevronUp size={20} color="#cba75c" /> : <ChevronDown size={20} color="#cba75c" />}
                  </button>
                  {openFaqIndex === index && (
                    <div style={{ padding: '0 20px 20px 20px', color: '#666', lineHeight: '1.6' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactFAQ;
