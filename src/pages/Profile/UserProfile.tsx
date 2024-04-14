import React from "react";
import { useParams } from "react-router";

export default function UserProfile() {
  const { uid } = useParams();
  return (
    <div>
      <h1>User {uid} profile</h1>
    </div>
  );
}
