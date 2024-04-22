import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FitCoinState } from "../../store";
import * as client from "../../Integrations/Strava/stravaClient";

const API_BASE = process.env.REACT_APP_API_BASE;

function Details() {
  const { did } = useParams();

  const [details, setDetails] = useState({
    resource_state: "",
    athlete: { id: "", resource_state: 0 },
    name: "",
    distance: 0,
    moving_time: 0,
    elapsed_time: 0,
    total_elevation_gain: 0,
    type: '',
    sport_type: '',
    id: 0,
    start_date: '',
    start_date_local: '',
    timezone: '',
    utc_offset: 0,
    location_city: null,
    location_state: null,
    location_country: null,
    achievement_count: 0,
    kudos_count: 0,
    comment_count: 0,
    athlete_count: 0,
    photo_count: 0,
    map: { id: '', summary_polyline: '', resource_state: 0 },
    trainer: false,
    commute: false,
    manual: false,
    private: false,
    visibility: '',
    flagged: false,
    gear_id: null,
    start_latlng: [],
    end_latlng: [],
    average_speed: 0,
    max_speed: 0,
    has_heartrate: false,
    heartrate_opt_out: false,
    display_hide_heartrate_option: false,
    elev_high: 0,
    elev_low: 0,
    pr_count: 0,
    total_photo_count: 0,
    has_kudoed: false
  });

  const stravaId = useSelector(
    (state: FitCoinState) => state.userReducer.stravaId,
  );
  const authToken = useSelector(
    (state: FitCoinState) => state.userReducer.authToken,
  );

  useEffect(() => {
    const fetchDetails = async () => {
      const activity = await client.getStravaActivity(stravaId, authToken, did || "");
      console.log(activity);
      setDetails(activity);
    }
    fetchDetails();
  }, []);

  return (
    <div>
      <h1>Details</h1>
      <p>Name: {details.name}</p>
      <p>Distance: {details.distance}</p>
      <p>Moving Time: {details.moving_time}</p>
      <p>Total Elevation Gain: {details.total_elevation_gain}</p>
      <p>Type: {details.type}</p>
      <p>Start Date: {details.start_date}</p>
      <p>City: {details.location_city}</p>
      <p>State: {details.location_state}</p>
      <p>Country: {details.location_country}</p>
      <p>Trainer: {details.trainer}</p>
      <p>Commute: {details.commute}</p>
      <p>Private: {details.private}</p>
      <p>Visibility: {details.visibility}</p>
      <p>Max Speed: {details.max_speed}</p>
      <p>Has Heartrate: {details.has_heartrate}</p>
      <p>Elevation High: {details.elev_high}</p>
      <p>Elevation Low: {details.elev_low}</p>
      <p>PR Count: {details.pr_count}</p>
      <p>Total Photo Count: {details.total_photo_count}</p>
      <p>Has Kudoed: {details.has_kudoed}</p>
    </div>
  );
}

export default Details;