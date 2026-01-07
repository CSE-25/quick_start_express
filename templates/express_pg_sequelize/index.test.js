import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("./db.js", () => ({
    default: {
        authenticate: jest.fn(() => Promise.resolve()),
        query: jest.fn(() => Promise.resolve([[{ "now()": new Date() }], {}])),
    },
}));

const { default: app } = await import("./index.js");
const { default: db } = await import("./db.js");

describe("express_pg_sequelize API Endpoints", () => {
    it("should return welcome message on GET /", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("Hello, Express with PostgreSQL!");
    });

    it("should return DB query results on GET /db-test", async () => {
        const res = await request(app).get("/db-test");
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("DB Query Successful!");
        expect(res.body.data).toBeDefined();
    });

    it("should handle DB errors on GET /db-test", async () => {
        db.query.mockImplementationOnce(() =>
            Promise.reject(new Error("DB Error")),
        );
        const res = await request(app).get("/db-test");
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toBe("Error querying the database");
    });
});
