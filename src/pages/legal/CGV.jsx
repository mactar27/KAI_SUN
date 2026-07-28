import React, { useEffect } from 'react';

const CGV = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: 'var(--kaia-cream)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', color: '#111' }}>
      <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '40px', color: '#0d2823' }}>
          Conditions Générales de Vente
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '16px', lineHeight: '1.8' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>1. Objet</h2>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes de lunettes de soleil et accessoires par Kaïa Sun, ci-après dénommé "le Vendeur", à toute personne effectuant un achat via le site Internet www.kaiasun.com, ci-après dénommé "le Client".</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>2. Produits et Prix</h2>
            <p>Les produits proposés à la vente sont ceux figurant sur le site au jour de sa consultation. Les prix sont indiqués en Francs CFA (XOF) et incluent la TVA applicable. Kaïa Sun se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>3. Commandes</h2>
            <p>La commande est validée une fois que le Client a complété le processus d'achat en ligne et confirmé son moyen de paiement. Un e-mail ou message de confirmation sera envoyé au Client pour attester de l'enregistrement de la commande.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>4. Paiement</h2>
            <p>Le règlement des achats s'effectue principalement par paiement à la livraison (espèces) pour les commandes locales (Dakar, Sénégal). D'autres moyens de paiement (Mobile Money, Carte Bancaire) pourront être proposés selon les options disponibles au moment du passage en caisse.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>5. Livraison</h2>
            <p>Les livraisons sont effectuées à l'adresse indiquée par le Client lors de sa commande. Les délais indicatifs sont de 24h à 48h ouvrées pour Dakar. La livraison est offerte à partir de l'achat de 2 paires. Les risques liés au transport sont transférés au Client dès la remise physique du produit.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>6. Retours et Échanges (Droit de rétractation)</h2>
            <p>Soucieux de votre satisfaction, le Client dispose d'un délai de 14 jours francs à compter de la réception de sa commande pour exercer son droit de rétractation. Le produit doit être retourné dans son état et emballage d'origine, non porté et accompagné de tous ses accessoires. Les frais de retour sont à la charge du Client.</p>
            <p style={{ marginTop: '8px' }}>Pour initier un retour, veuillez nous contacter à l'adresse email : <strong>contact@kaiasun.com</strong> ou via WhatsApp.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>7. Garanties</h2>
            <p>Nos produits bénéficient de la garantie légale de conformité contre les vices cachés. En cas de produit défectueux, il pourra être échangé sous réserve de présentation de la preuve d'achat et constatation du défaut de fabrication par nos équipes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>8. Propriété Intellectuelle</h2>
            <p>Tous les éléments du site Kaïa Sun (textes, images, logos, design) sont protégés par le droit d'auteur. Toute reproduction totale ou partielle est strictement interdite sans accord préalable.</p>
          </section>

          <section>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CGV;
