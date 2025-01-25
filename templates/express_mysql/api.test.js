import { jest } from "@jest/globals";
import request from "supertest";
import mysql from "mysql2/promise";
import app from "./index.js";
import db from "./connection/poolConnection.js";
import connectToDb from "./connection/normalConnection.js";

jest.mock("mysql2/promise");
jest.mock("./connection/poolConnection.js");
jest.mock("./connection/normalConnection.js");

describe("Express MySQL API Tests", () => {
  const mockConnection = {
    execute: jest.fn(),
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeAll(async () => {
    mysql.createConnection = jest.fn().mockResolvedValue(mockConnection);
    poolConnection.getConnection = jest.fn().mockResolvedValue(mockConnection);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close?.();
  });

  describe("database Connection", () => {
    it("connects to the database successfully", async () => {
      expect(mysql.createConnection).toHaveBeenCalled();
    });
  });

  describe("testing API Endpoints", () => {
    it("GET /api/sample returns all  samples", async () => {
      const dataOfMock = [
        {
          id: 1,
          name: "Test",
        },
      ];
      connectionMock.execute.mockResolvedValueOnce([dataOfMock]);

      const response = await request(myapp)
        .get("/api/sample")
        .expect("Content-Type", "/json/")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("POST /api/sample should create  new sample", async () => {
      const newSample = { name: "New sample" };
      connectionMock.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      const response = await request(myapp)
        .post("/api/sample")
        .send(newSample)
        .expect("Content-Type", "/json/")
        .expect(201);

      expect(response.body).toHaveProperty("id");
    });

    it("GET /api/sample/:id should return  specific sample", async () => {
      const mockSample = { id: 1, name: "Testing Sample" };
      connectionMock.execute.mockResolvedValueOnce([mockSample]);

      const response = await request(myapp)
        .get("/api/sample/1")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(mockSample);
    });

    it("PUT /api/sample/:id should update  sample", async () => {
      const updateData = { name: "Updated sample" };
      connectionMock.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await request(myapp).put("/api/sample/1").send(updateData).expect(200);
    });

    it("DELETE /api/sample/:id should delete  sample", async () => {
      connectionMock.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await request(myapp).delete("/api/sample/1").expect(204);
    });
  });

  describe("Handling Errors", () => {
    it("should handling database errors", async () => {
      connectionMock.execute.mockRejectedValueOnce(
        new Error("Error in Database!")
      );

      const response = await request(myapp)
        .get("/api/sample")
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });

    it("should handling not found errors", async () => {
      connectionMock.execute.mockResolvedValueOnce([[]]);

      await request(myapp).get("/api/sample/999").expect(404);
    });
  });

  describe("Connection Pool", () => {
    it("should use connection pool for queries", async () => {
      await request(myapp).get("/api/sample");
      expect(poolConnection.getConnection).toHaveBeenCalled();
      expect(connectionMock.release).toHaveBeenCalled();
    });
  });
});
