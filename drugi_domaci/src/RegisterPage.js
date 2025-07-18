import React, { useState } from 'react';

const RegisterPage = () => {
  const [role, setRole] = useState('korisnik'); // ili 'profesor'
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    let payload = {};
    let url = '';
    if(role === 'korisnik') {
      url = 'http://localhost:3000/api/register/korisnik';
      payload = {
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };
    } else {
      url = 'http://localhost:3000/api/register/profesor';
      payload = {
        email: formData.email,
        password: formData.password,
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if(response.ok) {
        setMessage('Registracija uspešna! Možete se prijaviti.');
        setFormData({
          ime: '',
          prezime: '',
          email: '',
          username: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        setErrors(data);
      }
    } catch (error) {
      setMessage('Došlo je do greške. Pokušajte ponovo.');
    }
  };

  return (
    <div>
      <h1>Registracija</h1>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="korisnik">Korisnik</option>
        <option value="profesor">Profesor</option>
      </select>

      <form onSubmit={handleSubmit}>
        {role === 'korisnik' && (
          <>
            <input
              type="text"
              name="ime"
              placeholder="Ime"
              value={formData.ime}
              onChange={handleChange}
            />
            {errors.ime && <p>{errors.ime}</p>}

            <input
              type="text"
              name="prezime"
              placeholder="Prezime"
              value={formData.prezime}
              onChange={handleChange}
            />
            {errors.prezime && <p>{errors.prezime}</p>}

            <input
              type="text"
              name="username"
              placeholder="Korisničko ime"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p>{errors.username}</p>}
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p>{errors.password}</p>}

        {role === 'korisnik' && (
          <>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Potvrdi lozinku"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            {errors.password_confirmation && <p>{errors.password_confirmation}</p>}
          </>
        )}

        <button type="submit">Registruj se</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;

