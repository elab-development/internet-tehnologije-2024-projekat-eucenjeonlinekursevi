import React from 'react';
import Button from './Button';
import './KursCard.css';

const KursCard = ({ kurs }) => {
  if (!kurs) return <p>Nema podataka o kursu</p>;

  return (
    <div className="kurs-card">
      <h2>{kurs.naziv}</h2>
      <p>{kurs.opis}</p>
      <Button label="Više info" onClick={() => alert(`Više informacija o kursu: ${kurs.naziv}`)} />
    </div>
  );
};

export default KursCard;