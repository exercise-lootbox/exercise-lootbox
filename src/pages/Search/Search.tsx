import axios from "axios";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import './index.css';
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FitCoinState } from "../../store/configureStore";
import { sampleResponse } from "./sampleResponse";
import { sportTypes, trainerTypes, sportIcon } from "../../types/index";

const API_BASE = process.env.REACT_APP_API_BASE;

function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const stravaId = useSelector(
    (state: FitCoinState) => state.persistedReducer.stravaId,
  );

  // Default search parameters
  const defaultParameters: {[key: string]: string} = {
    "stravaId" : "",
    "name" : "",
    "location_city" : "",
    "location_state" : "",
    "location_country" : "",
    "min_distance" : "",
    "max_distance" : "",
    "sport_type" : "",
    "date_before" : "",
    "date_after" : "",
    "trainer" : "",
  };

  const [parameters, setParameters] = useState(defaultParameters);
  const [results, setResults] = useState(sampleResponse);

  // When the URL changes (with search criteria), parse URL, update the parameters 
  // and get results from backend
  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    if (queryParams && stravaId) {
      const newParameters = { ...parameters };
      queryParams.forEach((value, key) => {
        newParameters[key] = value;
      });
      setParameters(newParameters);
      getResults(newParameters);
    }
  }, [location.search, stravaId]);

  // Makes API call to backend to get search results
  const getResults = async (params: any) => {
    if (params['stravaId'] === "") {
      params['stravaId'] = stravaId;
    }
    const response = await axios.get(`${API_BASE}/api/search`, {params: params});
    setResults(response.data);
  }

  // Handles changes in the search form inputs
  const handleParameterChange = (event: any, parameterName: string) => {
    const newParameters = { ...parameters };
    newParameters[parameterName] = event.target.value;
    setParameters(newParameters);
  }

  // Ensures that the minimum distance is less than the maximum distance (if both are set)
  // and that the date before is after the date after (if both are set)
  const verifyParameters = () => {
    if (parameters["min_distance"] !== "" && parameters["max_distance"] !== "") {
      if (parseInt(parameters["min_distance"]) > parseInt(parameters["max_distance"])) {
        alert("Minimum distance must be less than maximum distance.");
        return false;
      }
    }
    if (parameters["date_before"] !== "" && parameters["date_after"] !== "") {
      if (parameters["date_before"] < parameters["date_after"]) {
        alert("Date before must be after date after.");
        return false;
      }
    }
    return true;
  }

  // Functionality for when search button is pressed
  const handleSearch = (event: any) => {
    if (verifyParameters()) {
      // Construct the query parameters as a string
      const queryParams = Object.entries(parameters)
        .filter(([key, value]) => value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      // Navigate to the urlWithParams using the navigate function
      navigate({ pathname: '/search', search: queryParams });
    }
  }

  // Components and associated input type for search form
  const components = [
    ["name", "text"], 
    ["location_city", "text"], 
    ["location_state", "text"], 
    ["location_country", "text"], 
    ["min_distance", "number"], 
    ["max_distance", "number"], 
    ["date_before", "date"], 
    ["date_after", "date"]
  ]

  const constructLocationString = (city: string, state: string, country: string) => {
    let locationString = "";
    if (city) {
      locationString += city;
    }
    if (state) {
      locationString += city ? `, ${state}` : state;
    }
    if (country) {
      locationString += city || state ? `, ${country}` : country;
    }
    return locationString;
  }

  // Redirects to the details page for the selected activity
  const eventDetails = (resultId : string) => {
    // Only redirect if listed results are not sample results
    if (results !== sampleResponse) {
      navigate(`/details/${resultId}`);
    }
  }

  return (
    <div>
      <h1 className="search-header">Search {stravaId === "" ? "(not logged in)" : ""}</h1>
      <div className="search-page">
        <div className="search-bar">
          {components.map((component) => {
            const labelTitle = component[0].charAt(0).toUpperCase() + component[0].slice(1).replace('_', ' ');
            const unitsTitle = component[0].includes("distance") ? " (meters)" : "";
            return (
              <div className="form-input">
                <label htmlFor="searchInput">{labelTitle}{unitsTitle}</label>
                <br/>
                <input
                  type={component[1]}
                  id="searchInput"
                  className="width-220"
                  placeholder={`Activity ${labelTitle}`}
                  value={parameters[component[0]]}
                  onChange={(event) => handleParameterChange(event, component[0])}
                />
                <br />
              </div>
            );
          })}
          <Dropdown options={sportTypes} onSelect={handleParameterChange} attributeName={'sport_type'} currentState={parameters['sport_type']}/>
          <Dropdown options={trainerTypes} onSelect={handleParameterChange} attributeName={'trainer'} currentState={parameters['trainer']}/>
          <button className={`search-button ${stravaId === "" ? "bg-secondary pe-none" : ""}`} onClick={handleSearch} disabled={stravaId === ""}>
            Search
          </button>
          <p><i>{stravaId === "" ? "Log In For Search Functionality" : ""}</i></p>
        </div>
        <div className="results-page">
          {results.map((result: any) => {
            const displayDate = new Date(result.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const displaySportType = result.sport_type.replace(/\B(?=[A-Z])/g, ' ');
            const displaySportIcon = sportIcon(result.sport_type);
            const displayElapsedTime = new Date(result.elapsed_time * 1000).toISOString().substr(11, 8);
            const displayTrainer = result.trainer ? "Trainer" : "Not a Trainer";
            // const displayLocation = constructLocationString(result.location_city, result.location_state, result.location_country);
            const displayLocation = "Boston, Massachusetts, USA";
            return (
              <div className="result-item" onClick={() => eventDetails(result.id)}>
                <span className="result-header">
                  <span>
                    <h2 className="margin-bottom-10">{result.name}</h2>
                    <span className="result-body">
                      <p className="ml-0">{`${displaySportIcon} ${displaySportType}`}</p> 
                      <p className="separator">|</p>
                      <p>{`⏱️ ${displayElapsedTime}`}</p>
                      <p className="separator">|</p>
                      <p>{`💨 ${result.distance}`} meters</p>
                    </span>
                  </span>
                  <span className="right-header">
                    <p className="right-margin-5">{displayDate}</p>
                    <p>{displayLocation}</p>
                  </span> 
                </span>
                <p>{displayTrainer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;