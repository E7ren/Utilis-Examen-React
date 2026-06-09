import React, {  useEffect, useState } from 'react';
import axios from "axios";

const baseURL = "https://pokeapi.co/api/v2/pokemon/";

function Home() {

    const [pokemons, setPokemons] = useState([]);
    


//............................................................................
    const obtenerPokemons = async (url = null) => {
            try{
                const urlFinal = url ?? baseURL;
                const response = await axios.get(urlFinal);
                setPokemons(response.data);
            }catch(error) {
                console.error("ieeeeee", error);
            }
        };
    useEffect(() => {
        obtenerPokemons();
    },[]);

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
                                    <th>Nombre</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pokemons?.results?.map((pokemons) => (
                                    <tr key={pokemons.name}>
                                        <td>{pokemons.name}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <button disabled={pokemons.previous == null} onClick={() => obtenerPokemons(pokemons.previous)}>
                                Anterior
                            </button>

                            <button disabled={pokemons.next == null} onClick={() => obtenerPokemons(pokemons.next)}>
                                Next
                            </button>
                            
                        </div>

                    </div>
                </div>


            </div>


        </div>
    );
}

export default Home