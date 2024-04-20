import axios from "axios";
import { useState } from "react";
import Dropdown from "./Dropdown";

const API_BASE = process.env.REACT_APP_API_BASE;

function Search() {

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
  const handleSearch = async (event: any) => {
    if (verifyParameters()) {
      const response = await axios.get(`${API_BASE}/api/search`, {params: parameters});
      setResults(response.data);
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
    ["city", "text"], 
    ["state", "text"], 
    ["country", "text"], 
    ["min_distance", "number"], 
    ["max_distance", "number"], 
    ["date_before", "date"], 
    ["date_after", "date"]
  ]

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
          <Dropdown options={sportTypes} onSelect={handleParameterChange} attributeName={'sport_type'} />
          <Dropdown options={trainerTypes} onSelect={handleParameterChange} attributeName={'trainer'} />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="results-page">
          {results.map((result) => {
            return (
              <div className="result-item">
                <p>{JSON.stringify(result, null, 2)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;
