const API_URL = 'http://localhost:3000/api'; 

export const fetchKursevi = async () => {
  const response = await fetch(`${API_URL}/kursevi`);
  return await response.json();
};

export const fetchKurs = async (id) => {
  const response = await fetch(`${API_URL}/kursevi/${id}`);
  return await response.json();
};

export const fetchProfesor = async (id) => {
  const response = await fetch(`${API_URL}/profesori/${id}`);
  return await response.json();
};

export const loginUser = async (credentials, role='korisnik') => {
    const url = role === 'korisnik' ? 
    `${API_URL}/login/korisnik` : 
    `${API_URL}/login/profesor`;
    
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};