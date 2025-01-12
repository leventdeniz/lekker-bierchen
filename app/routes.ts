import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  ...prefix("drinks", [
    index("routes/drinks/home.tsx"),
    route(":id", "routes/drinks/drink.tsx"),
    route(":id/edit", "routes/drinks/edit.tsx"),
    route(":id/log", "routes/drinks/log.tsx"),
    route("new", "routes/drinks/new.tsx"),
  ]),

  ...prefix("breweries", [
    index("routes/breweries/home.tsx"),
    route(":id", "routes/breweries/brewery.tsx"),
    route("new", "routes/breweries/new.tsx"),
  ]),
] satisfies RouteConfig;
