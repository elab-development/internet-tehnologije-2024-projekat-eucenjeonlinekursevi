import { useState, useEffect } from 'react';

const useSearch = (items, searchKey) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const filtered = items.filter(item =>
      item[searchKey].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm, searchKey]);

  return { searchTerm, setSearchTerm, filteredItems };
};

export default useSearch;
