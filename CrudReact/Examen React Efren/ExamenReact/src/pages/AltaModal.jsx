import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../auth/AuthContext';
import * as Yup from 'yup';
import axios from 'axios';

const urlApi = import.meta.env.VITE_API_URL;


const SignupSchema = Yup.object().shape({
  texto: Yup.string()
    .trim()
    .required('El contingut de la nota es presis')
    .min(10, "Minim 10 caracters")
    .max(200, 'Máximo 200 caracteres'),
  color: Yup.string().required(),
});

const AltaModal = ({ showModal, closeModal, onSave, COLORS }) => {
  const { token } = useAuth();


  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (showModal) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showModal, closeModal]);

  if (!showModal) return null;

  return (
    <Formik
      initialValues={{ 
        texto: '', 
        color: COLORS[0]?.cls || 'note-yellow' 
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {

          const response = await axios.post(
            `${urlApi}notes/`,
            {
              
              text: values.texto, 
              color: values.color
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          console.log('Éxito:', response.data);
          
         
          if (onSave) {
            onSave(response.data); 
          }

          resetForm();
          closeModal();
        } catch (error) {
          console.error('Error al enviar:', error.response?.data || error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1100 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Form es el componente de Formik que reemplaza al <form> nativo */}
          <Form
            className="bg-white rounded-3 p-4"
            style={{ width: 280, border: '0.5px solid rgba(0,0,0,0.12)' }}
            role="dialog"
            aria-modal="true"
          >
            <p className="fw-500 mb-3" style={{ fontSize: 14, color: "#111" }}>
              Nueva nota
            </p>

            {/* Field con as="textarea" vincula el campo directamente a Formik */}
            <Field
              as="textarea"
              name="texto"    
              
              className="form-control mb-1"
              style={{
                height: 90, fontSize: 13, resize: "none",
                background: "#f5f5f5", color: "#111",
                border: "0.5px solid rgba(0,0,0,0.2)",
              }}
              placeholder="Escribe tu nota aquí..."
              maxLength={200}
              autoFocus
            />
            
            {/* Manejo de mensajes de error automático */}
            <ErrorMessage name="texto" component="div" className="text-danger small mb-3" />

            {/* Selector de colores integrado con el estado de Formik */}
            <div className="d-flex gap-2 mb-3">
              {COLORS.map((c) => (
                <div
                  key={c.cls}
                  className={`tablon-color-dot${values.color === c.cls ? " selected" : ""}`}
                  style={{ background: c.hex }}
                  onClick={() => setFieldValue('color', c.cls)} // Cambia el valor en Formik
                  role="radio"
                  aria-checked={values.color === c.cls}
                  tabIndex={0}
                />
              ))}
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="tablon-modal-btn-cancel border rounded-2 px-3 py-1"
                style={{ fontSize: 13, cursor: "pointer" }}
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="tablon-modal-btn-confirm border-0 rounded-2 px-3 py-1"
                style={{ fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default AltaModal;
