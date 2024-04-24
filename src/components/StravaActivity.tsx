import { FaStrava } from "react-icons/fa";

function StravaActivity({ activity, isCurrentUserActivity, onClick }: {
  activity: any,
  isCurrentUserActivity: boolean,
  onClick?: () => void
}) {
  function activityDateString(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <div onClick={onClick}>
      <div className="activity-title-container">
        <div className="activity-title">
          <FaStrava className="strava-icon" /> {activity.activityName} - {`${isCurrentUserActivity ? `Your ` : ` `}`}
          {activity.activityType} on{" "}
          {activityDateString(activity.activityStartDate)}
        </div>
        <div className="activity-title-coins">
          {`💰 FitCoins Earned: ${activity.coins}`}
        </div>
      </div>
      <div className="activity-subtitle">
        {`🏃 Distance: ${activity.distance.toFixed(2)} meters`}
      </div>
      <div className="activity-subtitle">
        {`⏱️ Active Time: ${(activity.movingTime / 60).toFixed(1)} minutes`}
      </div>
      <div className="activity-subtitle">
        {`⛰️ Elevation: ${activity.elevation.toFixed(2)} meters`}
      </div>
    </div>
  );
}

export default StravaActivity;
