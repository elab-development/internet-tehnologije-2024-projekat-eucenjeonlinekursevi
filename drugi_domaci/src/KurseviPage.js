import React, { useEffect, useState } from 'react';
import KursCard from './KursCardPage';

const KurseviPage = () => {
  const [kursevi, setKursevi] = useState([]);
  const [nazivFilter, setNazivFilter] = useState('');
  const [kategorijaFilter, setKategorijaFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchKursevi = async () => {
      try {
        const response = await fetch('/api/kursevi');
        setKursevi(response.data);
      } catch (error) {
        console.error("Greška pri učitavanju kurseva:", error);
      }
    };

    fetchKursevi();
  }, []);

  const filteredKursevi = kursevi.filter(kurs => {
    const nazivMatch = kurs.naziv.toLowerCase().includes(nazivFilter.toLowerCase());
    const kategorijaMatch = kategorijaFilter === '' || kurs.kategorija?.toLowerCase().includes(kategorijaFilter.toLowerCase());
    return nazivMatch && kategorijaMatch;
  });

  const totalPages = Math.ceil(filteredKursevi.length / itemsPerPage);
  const paginatedKursevi = filteredKursevi.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <h1>Svi kursevi</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Pretraga po nazivu"
          value={nazivFilter}
          onChange={(e) => { setPage(1); setNazivFilter(e.target.value); }}
        />
        <input
          type="text"
          placeholder="Kategorija"
          value={kategorijaFilter}
          onChange={(e) => { setPage(1); setKategorijaFilter(e.target.value); }}
          style={{ marginLeft: '10px' }}
        />
      </div>

      {paginatedKursevi.length === 0 ? (
        <p>Nema kurseva koji odgovaraju kriterijumima.</p>
      ) : (
        paginatedKursevi.map(kurs => (
          <KursCard
            key={kurs.id}
            kurs={kurs}
            onMoreInfo={() => window.location.href = `/kursevi/${kurs.id}`}
          />
        ))
      )}

      <div style={{ marginTop: '20px' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prethodna</button>
        <span style={{ margin: '0 10px' }}>Strana {page} od {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Sledeća</button>
      </div>
    </div>
  );
};

export default KurseviPage;