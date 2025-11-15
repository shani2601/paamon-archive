import { Track } from "../models/track.model";

export const Tracks: Track[] = [
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "אזור", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "תל אביב", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "רמת השרון", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "כפר סבא", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "הרצליה", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "פתח תקווה", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "ראשון לציון", launchState: "רצועת עזה"},
    {trackId: 0, launchTime: 0, impactTime: 0, impactCity: "בת ים", launchState: "רצועת עזה"}
]

function random10Digits(): number {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

function randomDateUpTo3HoursAgo(): number {
  const threeHoursMs = 3 * 60 * 60 * 1000;
  const randomOffset = Math.random() * threeHoursMs;
  return (Date.now() - randomOffset);
}

for (const track of Tracks) {
    track.trackId = random10Digits();
    track.launchTime = randomDateUpTo3HoursAgo();
    track.impactTime = track.launchTime + (90 * 1000);
}