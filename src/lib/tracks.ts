/** Section order must match [page.tsx](src/app/page.tsx) DOM order. */
export const TRACKS = [
  { id: "hero", num: "01", name: "Opening" },
  { id: "selected-work", num: "02", name: "The Hits" },
  { id: "experience", num: "03", name: "Tour History" },
  { id: "about", num: "04", name: "Liner Notes" },
  { id: "beyond-code", num: "05", name: "B-Sides" },
  { id: "contact", num: "06", name: "Encore" },
] as const;

export type TrackId = (typeof TRACKS)[number]["id"];

export const SIDE_A_ENTRY_ID = "side-a";
export const SIDE_B_ENTRY_ID = "side-b";

export const SIDE_A_TRACK_IDS: TrackId[] = [
  "hero",
  "selected-work",
  "experience",
  "about",
];

export const SIDE_B_TRACK_IDS: TrackId[] = ["beyond-code", "contact"];

export type AlbumSide = "a" | "b";

export function tracksForSide(side: AlbumSide | "full") {
  if (side === "a") {
    return TRACKS.filter((t) => SIDE_A_TRACK_IDS.includes(t.id as TrackId));
  }
  if (side === "b") {
    return TRACKS.filter((t) => SIDE_B_TRACK_IDS.includes(t.id as TrackId));
  }
  return [...TRACKS];
}
