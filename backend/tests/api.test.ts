import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { MemoryPlaceRepository } from "../src/repo/memory";

const app = createApp(new MemoryPlaceRepository());

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

  it("rechaza categorías con formato inválido", async () => {
    const res = await request(app).get("/api/places?category=DROP%20TABLE");
    expect(res.status).toBe(400);
  });

  it("GET /api/places/:slug devuelve un lugar", async () => {
    const res = await request(app).get("/api/places/teatro-baralt");
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("teatro-baralt");
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
