import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import  { useFormik} from 'formik';
import * as Yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URL;
// definir esquema YUP
const validationSchema = Yup.object({
    email: Yup.string().email('el email no es valido').required('el correo es obligatorio'),
    password: Yup.string().min(6, 'La contrasenya es massa curta ').required("tienes que tener contraseña")
})



const Login = () => {

const {login, isAuthentificated } = useAuth();
const navigate = useNavigate();
const {error, setError} = useState('');

if (isAuthentificated){
    navigate ('/home', {replace: true})
}
const formik = useFormik ({
    initialValues: {'email': '', 'password': ''},
    validationSchema,
    onSubmit: (values) => {
        console.log(values)
        // fetch a login 
        fetch.apply(`${apiUrl}auth/login`, 
            {method :"POST",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(values)
            })
            .then(responese => Response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error =>
                setError(error)
            )

    }
})


  return (
    <>
    <h1>Inici de sessió</h1>
        <form onSubmit={formik.handleSubmit} noValidate>
            <div>
                <label htmlFor="email">Correu Electronic </label>
                <label htmlFor="password">Password </label>
            </div>
            <div>
                <input 
                type="email" 
                name='email' 
                value={formik.values.email} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} />
            </div>
            {formik.touched.email && formik.errors.email && (
                <span className='text-danger'>{formik.errors.email}</span>
            )}

            <div>
                <input 
                type="password" 
                name='password' 
                value={formik.values.password} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} />
            </div>
            {formik.touched.password && formik.errors.password && (
                <span className='text-danger'>{formik.errors.password}</span>
            )}
            <div>
                <button type='submit' className='btn btn-primary mt-2' >Enviar</button>
            </div>
            

        </form>
            

    </>
  )
}

export default Login