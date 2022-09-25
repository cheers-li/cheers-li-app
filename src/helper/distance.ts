export const distance = (
  lat1?: number,
  lng1?: number,
  lat2?: number,
  lng2?: number,
) => {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 0;

  function toRadians(value: number) {
    return (value * Math.PI) / 180;
  }

  const R = 6371.071;
  const rlat1 = toRadians(lat1); // Convert degrees to radians
  const rlat2 = toRadians(lat2); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = toRadians(lng2 - lng1); // Radian difference (longitudes)

  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2),
      ),
    )
  );
};
