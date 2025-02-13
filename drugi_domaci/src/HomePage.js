import React, { useEffect, useState } from 'react';
import { fetchKursevi } from './services/api';
import KursCard from './KursCard';
import './HomePage.css';

const HomePage = () => {
  const [kursevi, setKursevi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getKursevi = async () => {
      try {
        const data = await fetchKursevi();
        setKursevi(data);
      } catch (error) {
        console.error('Greška pri učitavanju kurseva:', error);
      } finally {
        setLoading(false);
      }
    };

    getKursevi();
  }, []);

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="home-page">
      <h1>Dobrodošli na kurseve</h1>
      <div className="kursevi-list">
        {kursevi.length === 0 ? (
          <p>Nema dostupnih kurseva</p>
        ) : (
          kursevi.map((kurs) => (
            <KursCard key={kurs.id} kurs={kurs} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
