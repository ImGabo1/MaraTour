export interface Bounds {
  north: number;
  south: number;
  west: number;
  east: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Convierte latitud/longitud en un punto (x, y) dentro de un lienzo de width × height. */
export function project(
  latitude: number,
  longitude: number,
  bounds: Bounds,
  width: number,
  height: number
): Point {
  return {
    x: ((longitude - bounds.west) / (bounds.east - bounds.west)) * width,
    y: ((bounds.north - latitude) / (bounds.north - bounds.south)) * height,
  };
}

/**
 * Calcula los bordes del mapa para que quepan todos los puntos con margen
 * y el área tenga la misma proporción (ancho/alto) que el lienzo, sin deformar.
 */
export function boundsFor(
  points: { latitude: number; longitude: number }[],
  aspect: number,
  padding = 0.25
): Bounds {
  if (points.length === 0) {
    return { north: 10.68, south: 10.64, west: -71.64, east: -71.59 };
  }
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const spanLat = Math.max(maxLat - minLat, 0.004);
  const spanLng = Math.max(maxLng - minLng, 0.004);
  let height = spanLat * (1 + 2 * padding);
  let width = spanLng * (1 + 2 * padding);

  if (width / height < aspect) width = height * aspect;
  else height = width / aspect;

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  return {
    north: centerLat + height / 2,
    south: centerLat - height / 2,
    west: centerLng - width / 2,
    east: centerLng + width / 2,
  };
}

const mercatorY = (latitude: number): number =>
  Math.log(Math.tan(Math.PI / 4 + (latitude * Math.PI) / 360));

/**
 * Igual que `project`, pero con la latitud en Mercator: es la proyección de las
 * teselas del mapa base, así el pin cae exactamente sobre la imagen.
 */
export function projectMercator(
  latitude: number,
  longitude: number,
  bounds: Bounds,
  width: number,
  height: number
): Point {
  const top = mercatorY(bounds.north);
  const bottom = mercatorY(bounds.south);
  return {
    x: ((longitude - bounds.west) / (bounds.east - bounds.west)) * width,
    y: ((top - mercatorY(latitude)) / (top - bottom)) * height,
  };
}
