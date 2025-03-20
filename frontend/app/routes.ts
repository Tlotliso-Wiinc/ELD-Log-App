import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/trips", "routes/trips.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/trip", "routes/trip.tsx"),
] satisfies RouteConfig;
