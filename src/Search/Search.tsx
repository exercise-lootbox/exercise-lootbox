import axios from "axios";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import './index.css';
import { useLocation, useNavigate } from "react-router";

const API_BASE = process.env.REACT_APP_API_BASE;

function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultParameters: {[key: string]: string} = {
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
  const [results, setResults] = useState([]);

  // When the search criteria changes, update the parameters and get the results
  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    if (queryParams) {
      const newParameters = { ...parameters };
      queryParams.forEach((value, key) => {
        newParameters[key] = value;
      });
      setParameters(newParameters);
      getResults(newParameters);
    }
  }, [location.search]);

  // Makes API call to backend to get search results
  const getResults = async (params: any) => {
    const response = await axios.get(`${API_BASE}/api/search`, {params: params});
    setResults(response.data);
  }

  // Handles changes in the search form inputs
  const handleParameterChange = (event: any, parameterName: string) => {
    const newParameters = { ...parameters };
    newParameters[parameterName] = event.target.value.toLowerCase();
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

  // Options for 'sport_type' attribute dropdown
  const sportTypes = [
    "AlpineSki",
    "BackcountrySki",
    "Badminton",
    "Canoeing",
    "Crossfit",
    "EBikeRide",
    "Elliptical",
    "EMountainBikeRide",
    "Golf",
    "GravelRide",
    "Handcycle",
    "HighIntensityIntervalTraining",
    "Hike",
    "IceSkate",
    "InlineSkate",
    "Kayaking",
    "Kitesurf",
    "MountainBikeRide",
    "NordicSki",
    "Pickleball",
    "Pilates",
    "Racquetball",
    "Ride",
    "RockClimbing",
    "RollerSki",
    "Rowing",
    "Run",
    "Sail",
    "Skateboard",
    "Snowboard",
    "Snowshoe",
    "Soccer",
    "Squash",
    "StairStepper",
    "StandUpPaddling",
    "Surfing",
    "Swim",
    "TableTennis",
    "Tennis",
    "TrailRun",
    "Velomobile",
    "VirtualRide",
    "VirtualRow",
    "VirtualRun",
    "Walk",
    "WeightTraining",
    "Wheelchair",
    "Windsurf",
    "Workout",
    "Yoga"
  ];

  // Options for 'trainer' attribute dropdown
  const trainerTypes = ["True", "False"];

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

  return (
    <div>
      <h1 className="search-header">Search That Shi Up Boiiiii</h1>
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
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="results-page">
          {results.map((result: any) => {
            const displayDate = new Date(result.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const displaySportType = result.sport_type.replace(/\B(?=[A-Z])/g, ' ');
            const displayElapsedTime = new Date(result.elapsed_time * 1000).toISOString().substr(11, 8);
            const displayTrainer = result.trainer ? "Trainer" : "Not a Trainer";
            const displayLocation = constructLocationString(result.location_city, result.location_state, result.location_country);
            return (
              <div className="result-item">
                <h2>{result.name}</h2>
                <p>{displayDate}</p>
                <p>{displaySportType}</p>
                <p>{displayElapsedTime}</p>
                <p>{result.distance} meters</p>
                <p>{displayTrainer}</p>
                <p>{result.comment_count} comment{result.comment_count === 1 ? "" : "s"}</p>
                <p>{displayLocation}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;
