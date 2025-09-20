import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { kursevi as dummyKursevi } from './dummydata';


const KursPage = () => {
  const { id } = useParams();
  const [kurs, setKurs] = useState(null);

  useEffect(() => {
    const foundKurs = dummyKursevi.find(k => k.id === parseInt(id));
    setKurs(foundKurs);
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