export interface CustomFavicon {
  id: string;
  label: string;
  src: string;
}

export const customFavicons: readonly CustomFavicon[] = [
  { id: "spectrum", label: "Spectrum", src: "/Frame%202.png" },
  { id: "midnight", label: "Midnight", src: "/Frame%204.png" },
  { id: "coast", label: "Coast", src: "/Frame%205.png" },
  { id: "meadow", label: "Meadow", src: "/Frame%206.png" },
  { id: "alpine", label: "Alpine", src: "/Frame%207.png" },
  { id: "violet", label: "Violet", src: "/Frame%208.png" },
  { id: "gold", label: "Gold", src: "/Frame%209.png" },
];
