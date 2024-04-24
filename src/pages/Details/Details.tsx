import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FitCoinState } from "../../store/configureStore";
import { sampleDetails } from "./sampleDetails";
import * as client from "../../Integrations/Strava/stravaClient";
import "./index.css";

function Details() {
  const { did } = useParams();

  const [details, setDetails] = useState(sampleDetails);

  const authToken = useSelector(
    (state: FitCoinState) => state.persistedReducer.authToken,
  );
  const stravaId = useSelector(
    (state: FitCoinState) => state.persistedReducer.stravaId,
  );

  // Fetch details of the activity from backend
  useEffect(() => {
    const fetchDetails = async () => {
      if (stravaId !== "" && authToken !== "") {
        const activity = await client.getStravaActivity(stravaId, authToken, did || "");
        setDetails(activity);
      }
    }
    fetchDetails();
  }, [stravaId, authToken, did]);

  // Render the following components in the details page
  const componentsToRender = ['distance', 'moving_time', 'elapsed_time', 'total_elevation_gain', 
                              'sport_type', 'start_date', 'location_city', 'location_state', 'location_country', 
                              'achievement_count', 'kudos_count', 'comment_count', 'trainer', 'visibility', 
                              'average_speed', 'max_speed', 'elev_high', 'elev_low', 'pr_count']

  // Creates relevant units for the given value (i.e. 'meters' or 'seconds')
  const generateUnits = (key: string) => {
    if (key === 'distance') {
      return 'meters';
    } else if (key === 'moving_time' || key === 'elapsed_time') {
      return 'seconds';
    } else if (key === 'total_elevation_gain' || key === 'elev_high' || key === 'elev_low') {
      return 'meters';
    } else if (key === 'average_speed' || key === 'max_speed') {
      return 'meters per second';
    } else {
      return '';
    }
  }

  // Cleans up the date string to be more readable
  function cleanDateString(timestampString: string): string {
    const date: Date = new Date(timestampString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const createComponent = (key: string, value: any) => {
    if (componentsToRender.includes(key) && value !== null) {
      const displayValue = key === 'start_date' ? cleanDateString(value) : capitalizeFirstLetter(String(value));
      
      return (
        <p key={key}>
          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {displayValue} {generateUnits(key)}
        </p>
      );
    }
  }

  return (
    <div className="details-page">
      <h1>{String(details.name)}</h1>
      {Object.entries(details).map(([key, value]) => createComponent(key, value))}
    </div>
  );
}

export default Details;