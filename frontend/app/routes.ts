import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/trips", "routes/trips.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/log-sheets", "routes/log-sheets.tsx"),
  route("/trip/:id", "routes/trip.tsx"),
  route("/add-trip", "routes/add-trip.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
