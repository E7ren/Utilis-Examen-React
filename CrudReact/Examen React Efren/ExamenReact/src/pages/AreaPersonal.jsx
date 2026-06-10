import React from 'react'
import { useAuth } from '../auth/AuthContext'

const AreaPersonal = () => {
  const { user, logout } = useAuth();
  console.log(user)
  return (
    <div>AreaPersonal
      <p><b>Nombre : </b></p>
      <p>{user?.name}</p>

      <p><b>email</b></p>
      <p>{user?.email}</p>

      <p><b>id</b></p>
      <p>{user?.id}</p>

      <button className='btn btn-warning' onClick={logout}>Cerrar session</button>

    </div>
  )
}

export default AreaPersonal