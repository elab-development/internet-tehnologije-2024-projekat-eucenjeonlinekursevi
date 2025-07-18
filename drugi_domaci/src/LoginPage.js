import React, { useState } from 'react';
import { loginUser } from './services/api';
import InputField from './InputField';
import Button from './Button';
import Modal from './Modal';
import { useNavigate } from "react-router-dom";
 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState('korisnik');

const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;
    if (role === 'korisnik') {
      response = await loginUser({ email, password }, 'korisnik');
    } else {
      response = await loginUser({ email, password }, 'profesor');
    }
  
    if(response.success){
      navigate('/');
    }else{
      setShowModal(true);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <div>
        <label>
          <input
            type="radio"
            name="role"
            value="korisnik"
            checked={role === 'korisnik'}
            onChange={() => setRole('korisnik')}
          />
          Korisnik
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="profesor"
            checked={role === 'profesor'}
            onChange={() => setRole('profesor')}
          />
          Profesor
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lozinka"
          required
        />
        <Button
          type="submit"
          label="Uloguj se"
        />
      </form>
      {showModal && (
        <Modal
          message="Neuspesan login. Pokusajte ponovo."
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;