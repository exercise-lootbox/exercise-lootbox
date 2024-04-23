import axios from "axios";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import './index.css';
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FitCoinState } from "../../store";
import * as stravaClient from "../../Integrations/Strava/stravaClient";

const API_BASE = process.env.REACT_APP_API_BASE;

function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const stravaId = useSelector(
    (state: FitCoinState) => state.userReducer.stravaId,
  );

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

  const sampleResponse = 
    [ {
        "resource_state" : 2,
        "athlete" : {
          "id" : 134815,
          "resource_state" : 1
        },
        "name" : "Happy Friday",
        "distance" : 24931.4,
        "moving_time" : 4500,
        "elapsed_time" : 4500,
        "total_elevation_gain" : 0,
        "type" : "Ride",
        "sport_type" : "MountainBikeRide",
        "workout_type" : null,
        "id" : 154504250376823,
        "external_id" : "garmin_push_12345678987654321",
        "upload_id" : 987654321234567891234,
        "start_date" : "2018-05-02T12:15:09Z",
        "start_date_local" : "2018-05-02T05:15:09Z",
        "timezone" : "(GMT-08:00) America/Los_Angeles",
        "utc_offset" : -25200,
        "start_latlng" : null,
        "end_latlng" : null,
        "location_city" : "Boston",
        "location_state" : "Massachusetts",
        "location_country" : "United States",
        "achievement_count" : 0,
        "kudos_count" : 3,
        "comment_count" : 1,
        "athlete_count" : 1,
        "photo_count" : 0,
        "map" : {
          "id" : "a12345678987654321",
          "summary_polyline" : null,
          "resource_state" : 2
        },
        "trainer" : true,
        "commute" : false,
        "manual" : false,
        "private" : false,
        "flagged" : false,
        "gear_id" : "b12345678987654321",
        "from_accepted_tag" : false,
        "average_speed" : 5.54,
        "max_speed" : 11,
        "average_cadence" : 67.1,
        "average_watts" : 175.3,
        "weighted_average_watts" : 210,
        "kilojoules" : 788.7,
        "device_watts" : true,
        "has_heartrate" : true,
        "average_heartrate" : 140.3,
        "max_heartrate" : 178,
        "max_watts" : 406,
        "pr_count" : 0,
        "total_photo_count" : 1,
        "has_kudoed" : false,
        "suffer_score" : 82
      }, {
        "resource_state" : 2,
        "athlete" : {
          "id" : 167560,
          "resource_state" : 1
        },
        "name" : "Bondcliff",
        "distance" : 23676.5,
        "moving_time" : 5400,
        "elapsed_time" : 5400,
        "total_elevation_gain" : 0,
        "type" : "Ride",
        "sport_type" : "MountainBikeRide",
        "workout_type" : null,
        "id" : 1234567809,
        "external_id" : "garmin_push_12345678987654321",
        "upload_id" : 1234567819,
        "start_date" : "2018-04-30T12:35:51Z",
        "start_date_local" : "2018-04-30T05:35:51Z",
        "timezone" : "(GMT-08:00) America/Los_Angeles",
        "utc_offset" : -25200,
        "start_latlng" : null,
        "end_latlng" : null,
        "location_city" : null,
        "location_state" : null,
        "location_country" : "United States",
        "achievement_count" : 0,
        "kudos_count" : 4,
        "comment_count" : 0,
        "athlete_count" : 1,
        "photo_count" : 0,
        "map" : {
          "id" : "a12345689",
          "summary_polyline" : null,
          "resource_state" : 2
        },
        "trainer" : true,
        "commute" : false,
        "manual" : false,
        "private" : false,
        "flagged" : false,
        "gear_id" : "b12345678912343",
        "from_accepted_tag" : false,
        "average_speed" : 4.385,
        "max_speed" : 8.8,
        "average_cadence" : 69.8,
        "average_watts" : 200,
        "weighted_average_watts" : 214,
        "kilojoules" : 1080,
        "device_watts" : true,
        "has_heartrate" : true,
        "average_heartrate" : 152.4,
        "max_heartrate" : 183,
        "max_watts" : 403,
        "pr_count" : 0,
        "total_photo_count" : 1,
        "has_kudoed" : false,
        "suffer_score" : 162
      } ]

  const [parameters, setParameters] = useState(defaultParameters);
  const [results, setResults] = useState(sampleResponse);

  // When the search criteria changes, update the parameters and get the results
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

  const eventDetails = (resultId : string) => {
    if (results !== sampleResponse) {
      navigate(`/details/${resultId}`);
    }
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
              <div className="result-item" onClick={() => eventDetails(result.id)}>
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
