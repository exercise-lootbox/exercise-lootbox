import { FitCoinState } from "../../store/configureStore";
import { useState } from "react";
import * as adminClient from "../../Admin/adminClient";
import { useSelector } from "react-redux";
import "./AdminSearch.css";
import AdminResult from "../../components/AdminResult";
import { errorToast } from "../../components/toasts";

function AdminSearch() {
  const adminId = useSelector(
    (state: FitCoinState) => state.persistedReducer.adminId,
  );
  const authToken = useSelector(
    (state: FitCoinState) => state.persistedReducer.authToken,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      if (!adminId) {
        throw new Error("Admin ID not found");
      }
      const results = await adminClient.getUsersMatchingSearch(adminId, searchQuery, authToken);
      setSearchResults(results);
    } catch (error: any) {
      errorToast("Something went wrong. Please try again later.");
      console.error(error.message);
    }
  }

  const searchBar: JSX.Element = (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by first name, last name, or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="button primary-button small-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  )

  const searchResultsList: JSX.Element = (
    <div>
      {searchResults.map((result) =>
      (
        <div key={result._id}>
          <AdminResult result={result} />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <h1>Search for Users</h1>
      {searchBar}
      {searchResultsList}
    </div>
  )
}

export default AdminSearch;
