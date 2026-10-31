import { describe, expect, it } from "vitest";
import { googleMapsPlaceUrl, googleMapsSearchUrl } from "./maps";
import { boundsFor, project } from "./projection";

describe("maps", () => {
  it("arma el enlace al punto exacto", () => {
    const url = googleMapsPlaceUrl({ latitude: 10.6667, longitude: -71.6122 });
    expect(url).toBe("https://www.google.com/maps/search/?api=1&query=10.6667%2C-71.6122");
  });

  it("codifica la búsqueda general", () => {
    expect(googleMapsSearchUrl("Maracaibo, Zulia")).toContain("query=Maracaibo%2C%20Zulia");
  });
});

describe("projection", () => {
  const bounds = { north: 10.7, south: 10.6, west: -71.7, east: -71.5 };

  it("la esquina noroeste cae en (0, 0) y la sureste en (ancho, alto)", () => {
    expect(project(10.7, -71.7, bounds, 800, 400)).toEqual({ x: 0, y: 0 });
    const se = project(10.6, -71.5, bounds, 800, 400);
    expect(se.x).toBeCloseTo(800);
    expect(se.y).toBeCloseTo(400);
  });

  it("boundsFor incluye todos los puntos y respeta la proporción", () => {
    const pts = [
      { latitude: 10.66, longitude: -71.62 },
      { latitude: 10.67, longitude: -71.6 },
    ];
    const b = boundsFor(pts, 800 / 520);
    for (const p of pts) {
      expect(p.latitude).toBeLessThan(b.north);
      expect(p.latitude).toBeGreaterThan(b.south);
      expect(p.longitude).toBeGreaterThan(b.west);
      expect(p.longitude).toBeLessThan(b.east);
    }
    expect((b.east - b.west) / (b.north - b.south)).toBeCloseTo(800 / 520);
  });
});
