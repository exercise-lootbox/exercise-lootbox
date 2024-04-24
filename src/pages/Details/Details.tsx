import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router";
import { FitCoinState } from "../../store/configureStore";
import { sampleDetails } from "./sampleDetails";
import * as client from "../../Integrations/Strava/stravaClient";
import './index.css';

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
    const fetchDetails = async (sid: string) => {
      if (sid !== "" && authToken !== "") {
        const activity = await client.getStravaActivity(sid, authToken, did || "");
        setDetails(activity);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const otherUserStravaId = urlParams.get('stravaId');

    fetchDetails(otherUserStravaId || stravaId);
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

  const attributeIcon = (key: string) => {
    if (key === 'distance') {
      return '🏃';
    } else if (key === 'moving_time' || key === 'elapsed_time') {
      return '⏱️';
    } else if (key === 'total_elevation_gain') {
      return '🏔️';
    } else if (key === 'sport_type') {
      return '🏋️';
    } else if (key === 'start_date') {
      return '📅';
    } else if (key === 'location_city' || key === 'location_state' || key === 'location_country') {
      return '🌍';
    } else if (key === 'achievement_count') {
      return '🏆';
    } else if (key === 'kudos_count') {
      return '👍';
    } else if (key === 'comment_count') {
      return '💬';
    } else if (key === 'trainer') {
      return '🚴';
    } else if (key === 'visibility') {
      return '👁️';
    } else if (key === 'average_speed') {
      return '🚀';
    } else if (key === 'max_speed') {
      return '💨';
    } else if (key === 'elev_high') {
      return '🔝';
    } else if (key === 'elev_low') {
      return '🔽';
    } else if (key === 'pr_count') {
      return '🥇';
    } else {
      return '';
    }
  }

  const createComponent = (key: string, value: any) => {
    if (componentsToRender.includes(key) && value !== null) {
      const displayValue = key === 'start_date' ? cleanDateString(value) : capitalizeFirstLetter(String(value));

      return (
        <tr key={key}>
          <td className="left-column">
            {attributeIcon(key)} {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
          </td>
          <td>
            {displayValue} {generateUnits(key)}
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="details-page">
      <h1>{String(details.name)}</h1>
      <table className="details-table">
        {Object.entries(details).map(([key, value]) => createComponent(key, value))}
      </table>
    </div>
  );
}

export default Details;