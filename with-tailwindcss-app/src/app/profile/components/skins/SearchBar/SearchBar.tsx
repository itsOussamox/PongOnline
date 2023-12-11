"use client";
import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { BsSearch } from "react-icons/bs";

interface SearchBarState {
  searchTerm: string;
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Implement search functionality using the searchTerm
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <div className={styles.searchBoxContainer}>
        {/* <BsSearch className={styles.searchBoxContainer} /> */}
        <input
          id="search-box"
          type="text"
          className={styles.searchBox}
          name="q"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <label htmlFor="search-box">
          <span className={styles.searchIconContainer}>
          </span>
        </label>
      </div>
      <button type="submit" id="search-submit">Search</button>
    </form>
  );
};

export default SearchBar;