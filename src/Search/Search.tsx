import axios from "axios";
import { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

function Search() {

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event: any) => {
    const response = await axios.get(`${API_BASE}/api/search/${searchTerm}`);
    setResults(response.data);
  }

  return (
    <div>
      <h1>Search That Shi Up Boiiiii</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => {
          return <li>{result}</li>
        })}
      </ul>
    </div>
  );
}

export default Search;
