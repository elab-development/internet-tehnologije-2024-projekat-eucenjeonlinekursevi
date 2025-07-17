import React, { useState } from 'react';
import { loginUser } from './services/api';
import InputField from './InputField';
import Button from './Button';
import Modal from './Modal';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({ email, password });
    setShowModal(true);
  };

  return (
    <div>
      <h1>Login</h1>
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
          label="Prijavi se"
        />
      </form>
      {showModal && (
        <Modal
          message="Uspešno ste se ulogovali!"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;