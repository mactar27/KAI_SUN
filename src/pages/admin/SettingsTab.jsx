import React, { useState, useEffect } from 'react';

const SettingsTab = ({ adminToken }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) setSettings(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Save announcement banner
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ key: 'announcement_text', value: settings.announcement_text || '' })
      });
      alert("Paramètres enregistrés !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la sauvegarde.");
    }
    setIsSaving(false);
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>⚙️ Paramètres du Site</h2>
      
      {loading ? <p>Chargement...</p> : (
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
              Bannière d'annonce (Haut de page)
            </label>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>Laissez vide pour désactiver la bannière.</p>
            <input 
              type="text" 
              placeholder="Ex: Livraison offerte ce week-end à Dakar !" 
              value={settings.announcement_text || ''} 
              onChange={e => setSettings({ ...settings, announcement_text: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e5e5' }}
            />
          </div>
          
          <button type="submit" disabled={isSaving} style={{ padding: '12px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SettingsTab;
