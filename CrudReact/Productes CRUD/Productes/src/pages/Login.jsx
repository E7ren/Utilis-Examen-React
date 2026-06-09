import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom";
import { useClientAuth } from "../auth/client/ClientAuthContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email invàlid')
    .required('El email es obligatori'),
  password: Yup.string()
    .min(8, 'Minim 8 caracters')
    .max(20, 'Es massa llarg')
    .required('La contrasenya es obligatòria')
})

const Login = () => {
  const { login, isAuthenticated } = useClientAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}login/client`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "email": values.email,
            "password": values.password
          }),
        });

        if (!res.ok) {
          throw new Error("Error en email o contrasenya");
        }

        const data = await res.json();
        login(data.token);
        navigate("/");
      } catch (error) {
        console.error("Error al iniciar sessió:", error);
        setError("Error al iniciar sessió: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8 col-lg-6 col-xl-5'>
          <div className='card border-0 shadow-lg rounded-4 overflow-hidden'>
            <div className='card-header bg-primary text-white py-4'>
              <div className='text-center mb-3'>
                <Link to='/' className='text-white text-decoration-none d-inline-block mb-3'>
                  <i className='bi bi-lightbulb-fill fs-4'></i>
                  <span className='fw-bolder ps-2'>SELECTIO</span>
                </Link>
              </div>
              <div className='text-center'>
                <h2 className='mb-0 fw-bold'>Iniciar Sessió</h2>
                <p className='mb-0 opacity-75'>Accedeix al teu compte</p>
              </div>
            </div>

            <div className='card-body p-4 p-md-5'>
              {error && (
                <div className='alert alert-danger alert-dismissible fade show mb-4' role='alert'>
                  <i className='bi bi-exclamation-circle-fill me-2'></i>
                  <strong>Error:</strong> {error}
                  <button 
                    type='button' 
                    className='btn-close' 
                    onClick={() => setError('')}
                    aria-label='Tancar'
                  ></button>
                </div>
              )}
              <form onSubmit={formik.handleSubmit} className='needs-validation' noValidate>

                {/* Campo Email */}
                <div className='mb-4'>
                  <label className='form-label fw-medium'>
                    <i className='bi bi-envelope me-2'></i>
                    Email
                  </label>
                  <input
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    type='email'
                    name='email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='exemple@email.com'
                    disabled={loading}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback d-block">{formik.errors.email}</div>
                  ) : null}
                </div>

                {/* Campo Contraseña */}
                <div className='mb-4'>
                  <label className='form-label fw-medium'>
                    <i className='bi bi-key me-2'></i>
                    Contrasenya
                  </label>
                  <input
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    type='password'
                    name='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='Example.123'
                    disabled={loading}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="invalid-feedback d-block">{formik.errors.password}</div>
                  ) : null}
                </div>

                {/* Enlaces de ayuda */}
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <a href='#' className='text-decoration-none text-primary fw-medium'>
                    <i className='bi bi-question-circle me-1'></i>
                    Has oblidat la contrasenya?
                  </a>
                  <Link to='/registro' className='text-decoration-none text-primary fw-medium'>
                    <i className='bi bi-person-plus me-1'></i>
                    Registrar-se
                  </Link>
                </div>

                {/* Botón de inicio de sesión */}
                <div className='d-grid'>
                  <button
                    type='submit'
                    className='btn btn-primary btn-lg'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciant sessió...
                      </>
                    ) : (
                      <>
                        <i className='bi bi-box-arrow-in-right me-2'></i>
                        Iniciar Sessió
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className='card-footer bg-light text-center py-3'>
              <small className='text-muted'>
                © 2026 Selectio. Tots els drets reservats.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;