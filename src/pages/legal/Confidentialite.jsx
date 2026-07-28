import React, { useEffect } from 'react';

const Confidentialite = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: 'var(--kaia-cream)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', color: '#111' }}>
      <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '40px', color: '#0d2823' }}>
          Politique de Confidentialité
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '16px', lineHeight: '1.8' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>1. Introduction</h2>
            <p>Chez Kaïa Sun, nous attachons une grande importance à la protection de la vie privée et des données personnelles de nos clients. Cette Politique de Confidentialité décrit comment nous collectons, utilisons, et protégeons vos informations lors de votre visite et de vos achats sur notre site.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>2. Données collectées</h2>
            <p>Lorsque vous effectuez un achat ou vous inscrivez à notre newsletter, nous pouvons collecter les informations suivantes :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Nom, prénom, et civilité</li>
              <li>Adresse de livraison et de facturation</li>
              <li>Numéro de téléphone et adresse e-mail</li>
              <li>Historique de vos commandes</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>3. Utilisation des données</h2>
            <p>Vos données sont principalement utilisées pour :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Traiter et expédier vos commandes</li>
              <li>Gérer la relation client et répondre à vos demandes</li>
              <li>Vous informer de nos nouveautés via la newsletter (si vous y êtes abonné)</li>
              <li>Améliorer l'expérience utilisateur sur le site</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>4. Partage des données</h2>
            <p>Kaïa Sun s'engage à ne jamais vendre vos données personnelles à des tiers. Vos données peuvent uniquement être partagées avec nos partenaires logistiques (livreurs) dans le strict cadre de l'exécution de vos commandes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>5. Cookies</h2>
            <p>Notre site utilise des cookies essentiels pour assurer le bon fonctionnement du panier d'achat et la mémorisation de vos préférences. En naviguant sur le site, vous acceptez l'utilisation de ces cookies fonctionnels.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>6. Vos Droits</h2>
            <p>Vous disposez d'un droit d'accès, de modification, et de suppression de vos données personnelles. Pour toute demande, veuillez nous adresser un e-mail à : <strong>contact@kaiasun.com</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Confidentialite;
