export function extractTokenParameters(url: string) {
  const urlParams = new URLSearchParams(url.split("?")[1].split("#")[0]);

  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  const expiresAt = urlParams.get("expiresAt");
  const stravaId = urlParams.get("stravaId");

  return {
    accessToken,
    refreshToken,
    expiresAt,
    stravaId,
  };
}
