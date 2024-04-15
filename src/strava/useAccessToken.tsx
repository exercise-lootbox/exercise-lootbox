import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "./stravaClient";
import { FitCoinState } from "../store";
import { setStravaData } from "../pages/Login/userReducer";
import * as stravaClient from "./stravaClient";

const useAccessToken = () => {
  const dispatch = useDispatch();
  const reducer = useSelector((state: FitCoinState) => state.userReducer);
  const [returnToken, setReturnToken] = useState<string>("");

  useEffect(() => {
    setReturnToken(reducer.accessToken);
    const getAccessToken = async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (currentTimestamp >= reducer.expiresAt) {
        const { access_token, refresh_token, expires_at } =
          await refreshAccessToken(reducer.refreshToken);
        dispatch(
          setStravaData({
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: expires_at,
          }),
        );
        await stravaClient.updateStravaData(
          {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: expires_at,
          },
          reducer.userId,
          reducer.authToken,
        );
        return access_token;
      }

      return reducer.accessToken;
    };
    getAccessToken().then((token) => {
      setReturnToken(token);
    });
  }, [
    dispatch,
    reducer.accessToken,
    reducer.authToken,
    reducer.expiresAt,
    reducer.refreshToken,
    reducer.userId,
  ]);

  return returnToken;
};

export default useAccessToken;
