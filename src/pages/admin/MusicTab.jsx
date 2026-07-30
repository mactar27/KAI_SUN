import React, { useState, useEffect } from 'react';
import { upload } from '@vercel/blob/client';

const MusicTab = ({ adminToken }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/music');
      if (res.ok) {
        const data = await res.json();
        setTracks(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle || !selectedFile) return;

    setIsUploading(true);

    try {
      const newBlob = await upload(selectedFile.name, selectedFile, {
        access: 'public',
        handleUploadUrl: '/api/upload-music',
      });

      const res = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ title: newTitle, url: newBlob.url })
      });
      
      if (res.ok) {
        setNewTitle('');
        setSelectedFile(null);
        fetchTracks();
      }
    } catch (e) {
      console.error("Erreur:", e);
      alert("Erreur lors de l'upload du fichier. Vérifiez que Vercel Blob est bien configuré.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      const res = await fetch(`/api/music/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.ok) fetchTracks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette musique ?")) return;
    try {
      const res = await fetch(`/api/music/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.ok) fetchTracks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Ambiance Sonore</h2>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Ajouter une musique</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#555' }}>Titre (ex: Mélodie avec vague)</label>
            <input 
              type="text" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
              placeholder="Titre de la musique"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
              Fichier Audio (.mp3, .webm, .wav)
            </label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={e => setSelectedFile(e.target.files[0])} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isUploading}
            style={{ padding: '0.75rem 1.5rem', background: isUploading ? '#888' : 'var(--ink)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', justifySelf: 'start' }}
          >
            {isUploading ? 'Envoi en cours...' : 'Ajouter la musique'}
          </button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Musiques disponibles</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : tracks.length === 0 ? (
          <p style={{ color: '#777' }}>Aucune musique ajoutée pour le moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tracks.map(track => (
              <div key={track.id} className="responsive-flex-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', border: track.isActive ? '2px solid var(--ink)' : '1px solid #ddd', background: track.isActive ? '#fafafa' : '#fff' }}>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {track.title}
                    {track.isActive && <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--ink)', color: '#fff', borderRadius: '12px' }}>Active</span>}
                  </h4>
                  <a href={track.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'none', marginTop: '0.25rem', display: 'block' }}>{track.url}</a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!track.isActive && (
                    <button onClick={() => handleActivate(track.id)} style={{ padding: '0.5rem 1rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      Activer
                    </button>
                  )}
                  <button onClick={() => handleDelete(track.id)} style={{ padding: '0.5rem 1rem', background: '#ffeeee', color: '#d32f2f', border: '1px solid #ffcdcd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicTab;
