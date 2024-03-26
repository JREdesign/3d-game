import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import './estilos.css';

// Si la imagen está en tu proyecto, puedes importarla así:
// import logoMini from './ruta-a-logo-mini.jpg'; // Ajusta la ruta según sea necesario

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setCookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token, { path: '/' });
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/aframe");
    } catch (error) {
      console.error("Error de login:", error);
      alert("Fallo al iniciar sesión, verifica tus credenciales.");
    }
  };

  return (
    <>
      <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Usa el src de la imagen directamente si se encuentra en el directorio public, o usa la importación si la imagen está en tu proyecto */}
        <img src="logo-mini.png" alt="Logo" /> {/* Ajusta src según sea necesario */}
      </div>
      <div className="container">
        <div className="login form">
          <header>Login</header>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Introduce tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" className="button" value="Login" />
          </form>
          <div className="signup">
            <span>¿No tienes cuenta?
              <Link to="/register"> Regístrate</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;


