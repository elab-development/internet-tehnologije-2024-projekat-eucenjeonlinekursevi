import React, { useEffect, useState } from 'react';
import { fetchKursevi } from './services/api';
import KursCard from './KursCard';
import './HomePage.css';


const HomePage = () => {
  const [kursevi, setKursevi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKursevi, setFilteredKursevi] = useState([]);


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

  useEffect(() => {
  const filtered = kursevi.filter(kurs =>
    kurs.naziv.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredKursevi(filtered);
}, [searchTerm, kursevi]);

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="home-page">
      <h1>Dobrodošli na kurseve</h1>

      <input
      type="text"
      placeholder="Pretrazi kurseve po nazivu"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ padding: '8px', width: '100%', marginBottom: '20px' }}
      />

      <div className="kursevi-list">
        {filteredKursevi.length === 0 ? (
          <p>Nema dostupnih kurseva</p>
        ) : (
          filteredKursevi.map((kurs) => (
          <KursCard key={kurs.id} kurs={kurs} />
        ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
