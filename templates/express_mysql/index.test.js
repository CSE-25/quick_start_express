import request from "supertest";
import { expect } from "@jest/globals";
import { app, server } from "./index.js";
import db from "./connection/poolConnection.js";

afterAll(async () => {
    await db
        .promise()
        .end()
        .catch((err) => console.error("Error closing DB:", err));
    console.log("Database pool closed.");
    server.close();
});

describe("API Endpoints", () => {
    it("should return success message on GET /api/sample/test", async () => {
        const res = await request(app).get("/api/sample/test");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            MESSAGE: "It's Working. 👍🏻",
        });
    });

    it("should return all samples on GET /api/sample/all", async () => {
        const [expectedSamples] = await db
            .promise()
            .query("SELECT * FROM sample_table");
        const res = await request(app).get("/api/sample/all");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "MESSAGE",
            "Data fetched successfully.",
        );
        expect(res.body).toHaveProperty("DATA");
        expect(Array.isArray(res.body.DATA)).toBe(true);
        res.body.DATA.forEach((item) => {
            expect(item).toHaveProperty("id");
            expect(item).toHaveProperty("name");
            expect(typeof item.id).toBe("number");
            expect(typeof item.name).toBe("string");
        });
        expect(res.body.DATA).toEqual(expect.arrayContaining(expectedSamples));
    });
});
