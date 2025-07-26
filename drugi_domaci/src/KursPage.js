import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchKurs } from './services/api';


const KursPage = () => {
  const { id } = useParams();
  const [kurs, setKurs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchKurs(id);
      setKurs(data);
    };

    fetchData();
  }, [id]);

  if (!kurs) return <div>Loading...</div>;

  return (
    <div>
      <h1>{kurs.naziv}</h1>
      <p>{kurs.opis}</p>
    </div>
  );
};

export default KursPage;