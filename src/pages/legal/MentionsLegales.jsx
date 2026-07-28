import React, { useEffect } from 'react';

const MentionsLegales = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: 'var(--kaia-cream)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', color: '#111' }}>
      <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '40px', color: '#0d2823' }}>
          Mentions Légales
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '16px', lineHeight: '1.8' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>1. Éditeur du site</h2>
            <p>Le site Internet <strong>www.kaiasun.com</strong> est édité par la marque Kaïa Sun.</p>
            <p style={{ marginTop: '8px' }}>
              <strong>Email de contact :</strong> contact@kaiasun.com<br />
              <strong>Développeur :</strong> WockyTech (wockytech.xyz)
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>2. Hébergement</h2>
            <p>Le site est hébergé par Vercel Inc.<br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789, USA</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>3. Propriété Intellectuelle</h2>
            <p>L'ensemble du contenu présent sur le site (textes, images, illustrations, logos, vidéos, structure, et design) est la propriété exclusive de Kaïa Sun. Toute reproduction, représentation, modification, publication, ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Kaïa Sun.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>4. Données Personnelles</h2>
            <p>Conformément aux lois en vigueur sur la protection des données (notamment le RGPD européen applicable aux utilisateurs concernés), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter à contact@kaiasun.com.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: '600' }}>5. Responsabilité</h2>
            <p>Kaïa Sun s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, Kaïa Sun ne saurait être tenue pour responsable des erreurs ou omissions, ainsi que des dommages directs ou indirects résultant de l'utilisation du site.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
