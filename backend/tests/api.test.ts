import fs from "node:fs";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { MemoryPlaceRepository } from "../src/repo/memory";

const app = createApp(new MemoryPlaceRepository());
const seed = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../database/seed/places.json"), "utf8")
) as { slug: string }[];

describe("API de lugares", () => {
  it("GET /api/health responde ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.source).toBe("memory");
  });

  it("GET /api/places lista los lugares con su categoría", async () => {
    const res = await request(app).get("/api/places");
    expect(res.status).toBe(200);
    expect(res.body.meta.count).toBe(res.body.data.length);
    expect(res.body.data.length).toBeGreaterThan(0);
    const first = res.body.data[0];
    expect(first).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      categoryName: expect.any(String),
      latitude: expect.any(Number),
      longitude: expect.any(Number),
    });
  });

  it("GET /api/places?category= filtra por categoría", async () => {
    const res = await request(app).get("/api/places?category=cultura");
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: { category: string }) => p.category === "cultura")).toBe(true);
  });

  it("GET /api/places?q= busca por texto y sin acentos", async () => {
    const res = await request(app).get("/api/places?q=basilica");
    expect(res.status).toBe(200);
    expect(res.body.data.map((p: { slug: string }) => p.slug)).toContain("basilica-chiquinquira");
  });

  it("sirve todo el catálogo del seed y encuentra lugares que antes solo vivían en el frontend", async () => {
    const res = await request(app).get("/api/places");
    expect(res.body.data.length).toBe(seed.length);
    expect(seed.length).toBe(43);

    const maczul = await request(app).get("/api/places?q=maczul");
    expect(maczul.body.data.map((p: { slug: string }) => p.slug)).toContain("maczul");

    const salud = await request(app).get("/api/places?category=salud");
    expect(salud.body.data.length).toBeGreaterThan(0);
    expect(salud.body.data.every((p: { category: string }) => p.category === "salud")).toBe(true);
  });

  it("GET /api/places combina búsqueda y categoría", async () => {
    const res = await request(app).get("/api/places?q=teatro&category=cultura");
    expect(res.status).toBe(200);
    expect(res.body.data.map((p: { slug: string }) => p.slug)).toEqual(["teatro-baralt"]);

    const sinResultados = await request(app).get("/api/places?q=teatro&category=religioso");
    expect(sinResultados.status).toBe(200);
    expect(sinResultados.body.data).toEqual([]);
  });

  it("rechaza una búsqueda vacía", async () => {
    const res = await request(app).get("/api/places?q=");
    expect(res.status).toBe(400);
  });

  it("rechaza categorías con formato inválido", async () => {
    const res = await request(app).get("/api/places?category=DROP%20TABLE");
    expect(res.status).toBe(400);
  });

  it("GET /api/places/:slug devuelve un lugar", async () => {
    const res = await request(app).get("/api/places/teatro-baralt");
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("teatro-baralt");
  });

  it("cada lugar trae su galería (media) incluso si viene de imageUrl/panoUrl", async () => {
    const res = await request(app).get("/api/places/teatro-baralt");
    expect(Array.isArray(res.body.data.media)).toBe(true);
    const kinds = res.body.data.media.map((m: { kind: string }) => m.kind);
    expect(kinds).toContain("pano");
  });

  it("devuelve 404 para un lugar inexistente", async () => {
    const res = await request(app).get("/api/places/no-existe");
    expect(res.status).toBe(404);
  });

  it("todas las coordenadas del seed están dentro de la caja de Maracaibo", async () => {
    const res = await request(app).get("/api/places");
    for (const p of res.body.data as { latitude: number; longitude: number }[]) {
      expect(p.latitude).toBeGreaterThan(10.45);
      expect(p.latitude).toBeLessThan(10.85);
      expect(p.longitude).toBeGreaterThan(-71.85);
      expect(p.longitude).toBeLessThan(-71.45);
    }
  });
});
