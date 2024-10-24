"use client";
import React, { useState } from 'react';
import styles from './search-bar.module.css';

interface SearchBarProps {
  setSearchQuery:(query:string)=>void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery, placeholder = 'Search...' }) => {
  const [search, setSearch] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
      />
      <button type="submit" className={styles.searchButton}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;