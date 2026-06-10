import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'


const Header = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="col-12 d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="headerlogo">
          MiLogo
        </div>

        <nav className="gap-3 d-flex">
          <Link to="/">Inicio</Link>
          <Link to="/areaPersonal">Area Personal</Link>
        </nav>
      {/* if else if */}
        {
          !user ? (
        <button className="headerbutton">
          Iniciar sesión
        </button>
        ):(
          user.name
        )


        }
          
        

      </header>
    </>
  )
}

export default Header