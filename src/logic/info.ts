import type { InfoResponse } from "./types";

export function info(): InfoResponse {
  console.log("INFO");

  const response: InfoResponse = {
    apiversion: "1",
    author: "icyJoseph",
    color: "#75CFFF",
    head: "caffeine",
    tail: "coffee"
  };

  return response;
}
