import { describe, expect, it } from "vitest";
import type { Place } from "../types";
import { matchesQuery, normalize } from "./search";

const place: Place = {
  slug: "basilica-chiquinquira",
  name: "Basílica de Nuestra Señora de Chiquinquirá",
  category: "religioso",
  categoryName: "Fe y tradición",
  shortDescription: "Templo del casco histórico y sede de la devoción a la Chinita.",
  history: "La devoción a la Virgen de Chiquinquirá está en el corazón de la identidad zuliana.",
  address: "Casco histórico de Maracaibo",
  latitude: 10.6684,
  longitude: -71.6112,
  coordsVerified: false,
  imageUrl: null,
  panoUrl: "/panos/placeholder-atardecer.svg",
  tags: ["iglesia", "tradición", "centro"],
  media: [],
};

describe("búsqueda local", () => {
  it("ignora acentos y mayúsculas", () => {
    expect(normalize("Basílica")).toBe("basilica");
    expect(matchesQuery(place, "BASILICA")).toBe(true);
  });

  it("busca en nombre, etiquetas e historia", () => {
    expect(matchesQuery(place, "chinita")).toBe(true);
    expect(matchesQuery(place, "iglesia")).toBe(true);
    expect(matchesQuery(place, "zuliana")).toBe(true);
  });

  it("exige todas las palabras y no inventa resultados", () => {
    expect(matchesQuery(place, "basilica centro")).toBe(true);
    expect(matchesQuery(place, "basilica playa")).toBe(false);
    expect(matchesQuery(place, "   ")).toBe(true);
  });
});
