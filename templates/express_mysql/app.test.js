import request from "supertest";
import { expect, jest } from "@jest/globals";
import makeApp from "./app.js";

const expectedSamples = [
    { id: 1, name: "sample1" },
    { id: 2, name: "sample2" },
];

const getSamples = jest.fn().mockImplementation(async (req, res) => {
    return res.status(200).send({
        MESSAGE: "Data fetched successfully.",
        DATA: expectedSamples,
    });
});

const app = makeApp({ getSamples });

describe("API Endpoints", () => {
    it("should return success message on GET /api/sample/test", async () => {
        const res = await request(app).get("/api/sample/test");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            MESSAGE: "It's Working. 👍🏻",
        });
    });

    it("should return all samples on GET /api/sample/all", async () => {
        const res = await request(app).get("/api/sample/all");
        expect(getSamples.mock.calls.length).toBe(1);
        expect(getSamples).toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(Object),
        );
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
