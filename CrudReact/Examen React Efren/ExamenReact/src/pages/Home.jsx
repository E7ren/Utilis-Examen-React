import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import AltaModal from './AltaModal'
import "../index.css"

const urlApi = import.meta.env.VITE_API_URL;
const COLORS = [
    { cls: "note-yellow", hex: "#FFF9C4" },
    { cls: "note-pink",   hex: "#F8BBD0" },
    { cls: "note-blue",   hex: "#BBDEFB" },
    { cls: "note-green",  hex: "#C8E6C9" },
    { cls: "note-orange", hex: "#FFE0B2" },
  ];

  const NOTE_BG = {
    "note-yellow": "#FFF9C4",
    "note-pink":   "#F8BBD0",
    "note-blue":   "#BBDEFB",
    "note-green":  "#C8E6C9",
    "note-orange": "#FFE0B2",
  };

  function noteRot(id) {
  return ((id * 7919) % 9) - 4;
}

const Home = () => {
  const { token, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get(`${urlApi}notes/all`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const responseData = res.data;
      const parsedNotes = Array.isArray(responseData)
        ? responseData
        : responseData?.notes || responseData?.data || Object.values(responseData || {}).find(Array.isArray) || [];
      setNotes(parsedNotes);
    }).catch(err => {
      console.error(err);
      setError('Error al cargar les productos');
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  const handleSaveNote = ({ text, color }) => {
    const newNote = {
      id: Date.now(),
      text,
      color,
      done: false,
      date: new Date().toLocaleDateString('es-ES'),
      user: user?.name || user?.username || 'Tú',
    };

    setNotes(prev => [newNote, ...prev]);
    setShowModal(false);
  };

  
    const borrarNota = (id) => {
        axios.delete(`${urlApi}/notes/${id}`)
            .then(() => {
                // filter devuelve un nuevo array sin el elemento borrado
                setNotes(prev => prev.filter(p => p.id !== id));
            })
            .catch(error => console.error(error));
    };


  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
          <>

          

          {/* Posar just abans del </> del component principal */}
          <button
            className="btn btn-dark rounded-circle shadow"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '56px',
              height: '56px',
              fontSize: '1.5rem',
              zIndex: 1000,
            }}
            onClick={() => setShowModal(true)}
            title="Nova nota"
          >
            <i className="bi bi-plus-lg"></i>
          </button>

          <AltaModal
            showModal={showModal}
            closeModal={() => setShowModal(false)}
            onSave={handleSaveNote}
            COLORS={COLORS}
          />






         {/* Contenido sobre el corcho */}
           <div className="position-relative p-2" style={{ zIndex: 1 }}>

            {notes.length === 0 ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
                   style={{ color: "rgba(80,40,5,0.45)" }}>
                <span style={{ fontSize: 36 }}>📌</span>
                <p className="mb-0" style={{ fontSize: 13 }}>No hay notas todavía. ¡Añade la primera!</p>
              </div>
            ) : (
             <div className="d-flex flex-wrap gap-3" style={{ alignContent: "flex-start" }}>
                {notes.map(note => (
                  <div key={note.id} className="col">
                  <div
                    className={`tablon-note${note.done ? " done" : ""}`}
                    style={{
                      background: NOTE_BG[note.color],
                      transform: `rotate(${noteRot(note.id)}deg)`,
                    }}
                  >
                    <div className="tablon-note-pin" />
                    <div className={`tablon-note-text${note.done ? " done" : ""}`}>
                      {note.text}
                    </div>
                    <div className="tablon-note-date">{note.date}</div>
                    <div className="tablon-note-user"> {note.user}</div>
                    <div className="tablon-note-actions">
                      <button
                        className="tablon-note-btn done-btn"
                        aria-label={note.done ? "Marcar pendiente" : "Marcar completada"}
                      >
                        {note.done ? "↺" : "✓"}
                      </button>
                      <button
                        className="tablon-note-btn del-btn"
                        aria-label="Eliminar nota"
                        onClick={() => borrarNota(note.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            )}
        </div>



    </>
  );
}

export default Home