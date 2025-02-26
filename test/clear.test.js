import path from "node:path";
import {
    existsSync,
    mkdirSync,
    readdirSync,
    writeFileSync,
    rmSync,
} from "node:fs";
import { fileURLToPath } from "url";
import { jest, expect } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "test-temp-dir");
const mockConfirm = jest.fn();

jest.unstable_mockModule("@inquirer/prompts", () => ({
    confirm: mockConfirm,
}));

let clearCWD;

beforeAll(async () => {
    const clearModule = await import("../bin/util/clear.js");
    clearCWD = clearModule.clearCWD;
});

function createTempDir() {
    if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
    }
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(path.join(tempDir, "test1"), "console.log('test1');");
    writeFileSync(path.join(tempDir, "test2.js"), "console.log('test2');");

    const testDirPath = path.join(tempDir, "nested-dir");
    mkdirSync(testDirPath);
    writeFileSync(path.join(testDirPath, "test3.txt"), "console.log('test3');");
}

function listDirContents() {
    if (existsSync(tempDir)) {
        return readdirSync(tempDir);
    } else {
        return [];
    }
}

function removeTempDir() {
    if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
    }
}

describe("qse clear command function", () => {
    beforeEach(() => {
        jest.resetModules();
        createTempDir();
        jest.spyOn(process, "cwd").mockReturnValue(tempDir);
        mockConfirm.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.clearAllMocks();
        removeTempDir();
    });

    test("remove files when user confirms", async () => {
        expect(listDirContents().length).toBeGreaterThan(0);
        mockConfirm.mockResolvedValue(true);

        await clearCWD();

        expect(listDirContents().length).toBe(0);
        expect(mockConfirm).toHaveBeenCalled();
    });

    test("does not remove files when user canceles", async () => {
        const initialContents = listDirContents();
        expect(initialContents.length).toBeGreaterThan(0);
        mockConfirm.mockResolvedValue(false);

        await clearCWD();

        expect(listDirContents()).toEqual(initialContents);
        expect(mockConfirm).toHaveBeenCalled();
    });
});
