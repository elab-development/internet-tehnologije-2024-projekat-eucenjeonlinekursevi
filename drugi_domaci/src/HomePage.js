import React, { useEffect, useState } from 'react';
import { fetchKursevi } from './services/api';
import KursCard from './KursCardPage';
import './HomePage.css';
import Modal from './Modal';
import useSearch from './useSearch';

const HomePage = () => {
  const [kursevi, setKursevi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedKurs, setSelectedKurs] = useState(null);

  const openModal = (kurs) => {
  setSelectedKurs(kurs);
  setShowModal(true);
};

  const closeModal = () => {
  setShowModal(false);
  setSelectedKurs(null);
};

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

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(kursevi, 'naziv');

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="home-page">
      <h1>Dobrodošli na kurseve</h1>

      <input
        type="text"
        placeholder="Pretraži kurseve po nazivu"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '20px' }}
      />

      <div className="kursevi-list">
        {filteredItems.length === 0 ? (
          <p>Nema dostupnih kurseva</p>
        ) : (
          filteredItems.map((kurs) => (
            <KursCard 
              key={kurs.id} 
              kurs={kurs} 
              onMoreInfo={() => openModal(kurs)} 
            />
          ))
        )}
      </div>

      {showModal && selectedKurs && (
        <Modal onClose={closeModal}>
          <h2>{selectedKurs.naziv}</h2>
          <p>{selectedKurs.opis}</p>
          <button onClick={closeModal}>Zatvori</button>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
