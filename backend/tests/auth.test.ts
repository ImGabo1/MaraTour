import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { hashPassword, verifyPassword } from "../src/auth/password";
import { MemoryPlaceRepository } from "../src/repo/memory";
import { MemoryUserRepository } from "../src/repo/users-memory";

function makeApp() {
  return createApp(new MemoryPlaceRepository(), { userRepository: new MemoryUserRepository() });
}

const account = {
  name: "Ana Pérez",
  email: "ana@example.com",
  password: "clave-segura-123",
};

describe("contraseñas", () => {
  it("genera un hash scrypt y verifica la contraseña", async () => {
    const hash = await hashPassword(account.password);
    expect(hash).toMatch(/^scrypt\$/);
    expect(hash).not.toContain(account.password);
    await expect(verifyPassword(account.password, hash)).resolves.toBe(true);
    await expect(verifyPassword("otra-clave", hash)).resolves.toBe(false);
    await expect(verifyPassword(account.password, "formato-invalido")).resolves.toBe(false);
  });
});

describe("API de autenticación", () => {
  it("registra una cuenta y no devuelve el hash", async () => {
    const res = await request(makeApp()).post("/api/auth/register").send(account);
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ name: account.name, email: account.email });
    expect(res.body.data.id).toEqual(expect.any(String));
    expect(res.body.data.createdAt).toEqual(expect.any(String));
    expect(res.body.data).not.toHaveProperty("passwordHash");
    expect(res.body.data).not.toHaveProperty("password_hash");
  });

  it("rechaza un correo ya registrado sin distinguir mayúsculas", async () => {
    const app = makeApp();
    await request(app).post("/api/auth/register").send(account).expect(201);
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...account, email: "ANA@EXAMPLE.COM" });
    expect(res.status).toBe(409);
  });

  it("inicia sesión con las credenciales correctas", async () => {
    const app = makeApp();
    await request(app).post("/api/auth/register").send(account).expect(201);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ANA@EXAMPLE.COM", password: account.password });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ name: account.name, email: account.email });
  });

  it("rechaza contraseña incorrecta y correo inexistente con 401", async () => {
    const app = makeApp();
    await request(app).post("/api/auth/register").send(account).expect(201);

    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: account.email, password: "no-es-la-clave" });
    expect(wrongPassword.status).toBe(401);

    const unknown = await request(app)
      .post("/api/auth/login")
      .send({ email: "nadie@example.com", password: account.password });
    expect(unknown.status).toBe(401);
  });

  it("valida los datos de registro y login", async () => {
    const app = makeApp();
    expect(
      (await request(app).post("/api/auth/register").send({ ...account, password: "corta" })).status
    ).toBe(400);
    expect(
      (await request(app).post("/api/auth/register").send({ ...account, email: "no-es-correo" })).status
    ).toBe(400);
    expect(
      (await request(app).post("/api/auth/login").send({ email: account.email, password: "" })).status
    ).toBe(400);
  });

  it("/api/health indica que la autenticación usa memoria en tests", async () => {
    const res = await request(makeApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.authSource).toBe("memory");
  });
});
