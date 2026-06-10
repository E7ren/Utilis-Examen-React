// Importamos React y los hooks que necesitamos:
// - useEffect: para ejecutar código cuando el componente carga o cambia algo
// - useState: para guardar datos que pueden cambiar (y que al cambiar re-renderizan el componente)
import React, { useEffect, useState } from 'react';

// axios es una librería para hacer peticiones HTTP (GET, POST, DELETE...) a una API
import axios from "axios";

// useFormik es el hook principal de Formik — gestiona los valores, errores y envío del formulario
import { useFormik } from 'formik';

// Yup sirve para definir las reglas de validación del formulario
import * as Yup from 'yup';

// URLs base de la API
const baseURL =   "https://selectio.dwec.iesevalorpego.es/api/product";
const familyURL = "https://selectio.dwec.iesevalorpego.es/api/family";

// ── ESQUEMA DE VALIDACIÓN (Yup) ──────────────────────────────────────────────
// Aquí definimos las reglas que deben cumplir los campos del formulario.
// Yup.object({ campo: Yup.tipo().regla().regla()... })
const validationSchema = Yup.object({
    name:        Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    // typeError se muestra si escriben letras en un campo numérico
    // min(0) impide precios negativos
    price:       Yup.number().typeError('Debe ser un número').min(0, 'No puede ser negativo').required('El precio es obligatorio'),
    family_id:   Yup.string().required('La familia es obligatoria'),
});

function Home() {

    // ── ESTADOS (useState) ───────────────────────────────────────────────────
    // useState(valorInicial) devuelve [valorActual, funcionParaCambiarlo]

    const [productes, setProductes] = useState([]);      // lista de productos de la API
    const [page, setPage] = useState(1);                 // página actual de la paginación
    const [lastPage, setLastPage] = useState(1);         // última página disponible
    const [family, setFamily] = useState([]);            // lista de familias para el select
    const [search, setSearch] = useState('');            // texto del buscador
    const [showForm, setShowForm] = useState(false);     // true = mostrar formulario, false = ocultarlo
    const [formError, setFormError] = useState('');      // mensaje de error al crear producto

    // ── CARGAR PRODUCTOS (useEffect) ─────────────────────────────────────────
    // useEffect(() => { código }, [dependencias])
    // Se ejecuta cada vez que cambia 'page'
    useEffect(() => {
        // Petición GET a la API con el número de página como parámetro
        axios.get(`${baseURL}?page=${page}`).then(res => {
            setProductes(res.data.data.data);        // guardamos el array de productos
            setLastPage(res.data.data.last_page);    // guardamos el total de páginas
        });
    }, [page]); // <-- [page] significa: "ejecuta esto cada vez que 'page' cambie"

    // ── CARGAR FAMILIAS (useEffect) ──────────────────────────────────────────
    // El array vacío [] significa: "ejecuta esto solo una vez al montar el componente"
    useEffect(() => {
        axios.get(familyURL).then(res => {
            setFamily(res.data.data);
        });
    }, []);

    // ── FUNCIÓN BORRAR ───────────────────────────────────────────────────────
    // Recibe el id del producto, hace DELETE a la API y lo elimina del estado local
    const borrarProducte = (id) => {
        axios.delete(`${baseURL}/${id}`)
            .then(() => {
                // filter devuelve un nuevo array sin el elemento borrado
                setProductes(prev => prev.filter(p => p.id !== id));
            })
            .catch(error => console.error(error));
    };

    // ── FORMULARIO CON FORMIK ────────────────────────────────────────────────
    // useFormik recibe un objeto de configuración y devuelve todo lo necesario para el form
    const formik = useFormik({

        // initialValues: los valores iniciales de cada campo (deben coincidir con los name= del input)
        initialValues: {
            name: '',
            description: '',
            price: '',
            family_id: '',
        },

        // validationSchema: el esquema Yup que definimos arriba
        validationSchema,

        // onSubmit: función que se ejecuta cuando el formulario se envía y pasa las validaciones
        // 'values' tiene los datos del formulario, 'resetForm' limpia los campos
        onSubmit: (values, { resetForm }) => {
            setFormError('');
            // POST a la API con los datos del formulario
            axios.post(baseURL, values)
                .then(res => {
                    // Añadimos el nuevo producto al inicio de la lista sin recargar
                    setProductes(prev => [res.data.data, ...prev]);
                    resetForm();           // limpia los campos del formulario
                    setShowForm(false);    // oculta el formulario
                })
                .catch(() => setFormError('Error al crear el producto'));
        },
    });

    // ── FILTRADO LOCAL (buscador) ────────────────────────────────────────────
    // Filtramos el array de productos según el texto del buscador
    // Buscamos en nombre Y en descripción (|| = O)
    // toLowerCase() para que la búsqueda no distinga mayúsculas/minúsculas
    const productesFiltrats = productes.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='container py-4'>

            {/* ── BUSCADOR + BOTÓN ── */}
            <div className='mb-3 d-flex gap-2 align-items-center'>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Buscar por nombre o descripción...'
                    value={search}
                    // Cada vez que el usuario escribe, actualizamos el estado 'search'
                    onChange={e => setSearch(e.target.value)}
                />
                {/* Al hacer click alternamos showForm entre true y false (v => !v) */}
                <button className='btn btn-success text-nowrap' onClick={() => setShowForm(v => !v)}>
                    {showForm ? 'Cancelar' : '+ Nuevo producto'}
                </button>
            </div>

            {/* ── FORMULARIO (solo se muestra si showForm === true) ── */}
            {showForm && (
                <div className='card mb-4 p-3'>
                    <h5>Crear producto</h5>

                    {/* Mensaje de error de la API (solo si existe) */}
                    {formError && <div className='alert alert-danger'>{formError}</div>}

                    {/* formik.handleSubmit gestiona el submit: valida y llama a onSubmit */}
                    {/* noValidate desactiva la validación nativa del navegador */}
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <div className='row g-2'>

                            {/* ── CAMPO NOMBRE ── */}
                            <div className='col-md-3'>
                                <input
                                    // Si el campo fue tocado (touched) Y tiene error → clase is-invalid (Bootstrap pone borde rojo)
                                    className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                    name='name'
                                    placeholder='Nombre'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}  // actualiza el valor en formik
                                    onBlur={formik.handleBlur}      // marca el campo como "tocado" al salir
                                />
                                {/* Mensaje de error debajo del input (solo si tocado y con error) */}
                                {formik.touched.name && formik.errors.name && (
                                    <div className='invalid-feedback'>{formik.errors.name}</div>
                                )}
                            </div>

                            {/* ── CAMPO DESCRIPCIÓN ── */}
                            <div className='col-md-3'>
                                <input
                                    className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                    name='description'
                                    placeholder='Descripción'
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <div className='invalid-feedback'>{formik.errors.description}</div>
                                )}
                            </div>

                            {/* ── CAMPO PRECIO ── */}
                            <div className='col-md-2'>
                                <input
                                    className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                                    name='price'
                                    type='number'
                                    placeholder='Precio'
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <div className='invalid-feedback'>{formik.errors.price}</div>
                                )}
                            </div>

                            {/* ── SELECT FAMILIA ── */}
                            <div className='col-md-2'>
                                <select
                                    className={`form-select ${formik.touched.family_id && formik.errors.family_id ? 'is-invalid' : ''}`}
                                    name='family_id'
                                    value={formik.values.family_id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value=''>Familia...</option>
                                    {/* Generamos una <option> por cada familia cargada de la API */}
                                    {family.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                                {formik.touched.family_id && formik.errors.family_id && (
                                    <div className='invalid-feedback'>{formik.errors.family_id}</div>
                                )}
                            </div>

                            {/* ── BOTÓN ENVIAR ── */}
                            <div className='col-md-2'>
                                <button type='submit' className='btn btn-primary w-100'>Crear</button>
                            </div>

                        </div>
                    </form>
                </div>
            )}

            {/* ── TABLA DE PRODUCTOS ── */}
            <table className="table table-bordered table-hover">
                <thead className='table-dark'>
                    <tr>
                        <th>id</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Activo</th>
                        <th>Favorito</th>
                        <th>Familia</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Recorremos el array filtrado (si no hay búsqueda, muestra todos) */}
                    {productesFiltrats.map(producte => (
                        <tr key={producte.id}>
                            <td>{producte.id}</td>
                            <td>{producte.name}</td>
                            <td>{producte.description}</td>
                            <td>{producte.price}</td>
                            {/* Operador ternario: si es true muestra 'Sí', si no 'No' */}
                            <td>{producte.active ? 'Sí' : 'No'}</td>
                            <td>{producte.favorite ? 'Sí' : 'No'}</td>
                            {/* Buscamos en el array 'family' la familia cuyo id coincide con el del producto */}
                            {/* ?. (optional chaining) evita error si no encuentra nada */}
                            <td>{family.find(f => f.id === producte.family_id)?.name}</td>
                            <td>
                                {/* Pasamos una arrow function para poder enviar el id como argumento */}
                                <button className='btn btn-danger btn-sm me-1' onClick={() => borrarProducte(producte.id)}>Borrar</button>
                                <button className='btn btn-warning btn-sm'>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ── PAGINACIÓN ── */}
            <div className='d-flex align-items-center gap-2'>
                {/* disabled evita clics cuando ya estamos en el límite */}
                <button className='btn btn-outline-secondary btn-sm' disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
                <span>Página {page} de {lastPage}</span>
                <button className='btn btn-outline-secondary btn-sm' disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Siguiente</button>
            </div>

        </div>
    );
}

export default Home