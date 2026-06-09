import React, {  createContext, useContext, useEffect, useState } from 'react';
import { useAdminAuth } from '../auth/backoffice/AdminAuthContext';
import axios from "axios";

const baseURL =     "https://selectio.dwec.iesevalorpego.es/api/product";
const familyURL =   "https://selectio.dwec.iesevalorpego.es/api/family";

function Home() {


    const [productes, setProductes] = useState([]);

//---------------------------------------------------------------------Productes Paginats
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [family, setFamily] = useState([]);

    useEffect(() =>{
        axios.get(`${baseURL}?page=${page}`).then(res => {
            setProductes(res.data.data.data);
            setLastPage(res.data.data.last_page);
        });
    }, [page]);
    
//............................................................................ Funcio borrar

const borrarProducte = (id) => {
    axios
    .delete('${baseURL}/${id}', {
        headers: {

        }
    })
    .then(() =>{
        setProductes(prev =>
            prev.filter(producte => producte.id !== id)
        );
    })
    .catch(error => {
        console.error(error);
    });
};    
//............................................................................

    useEffect(() =>{
        axios.get(familyURL).then(res => {
            setFamily(res.data.data)
        })
    },[]);

//............................................................................

// const fetchData = async (url = null) => {
//             try{
//                 const urlFinal = url ?? baseURL;
//                 const response = await axios.get(urlFinal);
//                 setProductes(response.data);
//             }catch(error) {
//                 console.error(error);
//             }
//         };
//     useEffect(() => {
//         fetchData();
//     },[]);
//............................................................................

    return (
        <div>

            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h1>Tabla</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Nombre</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>active</th>
                                    <th>favorite</th>
                                    <th>family</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {productes?.map((productes) => (
                                    <tr key={productes.id}>
                                        <td>{productes.id}</td>
                                        <td>{productes.name}</td>
                                        <td>{productes.description}</td>
                                        <td>{productes.price}</td>
                                        <td>{productes.active}</td>
                                        <td>{productes.favorite}</td>
                                        <td>{
                                         family.find(f => f.id === productes.family_id)?.name}
                                         </td>
                                         <td>
                                            <button onClick={() => borrarProducte(productes.id)}>Borrar</button>
                                            <button>Editar</button>
                                         </td>
                                    </tr>
                                    
                                ))}

                            </tbody>
                        </table>
                        <div>
                                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
                                <span>Página {page} de {lastPage}</span>
                                <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Siguiente</button>
                            
                            
                        </div>

                    </div>
                </div>


            </div>


        </div>
    );
}

export default Home