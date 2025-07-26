import React from 'react';
import './KursCard.css';

const KursCard = ({ kurs, onMoreInfo }) => {
  if (!kurs) return <p>Nema podataka o kursu</p>;

  return (
    <div className="kurs-card">
      <h2>{kurs.naziv}</h2>
      <p>{kurs.opis}</p>
      <button onClick={onMoreInfo}>Više info</button>
    </div>
  );
};

export default KursCard;