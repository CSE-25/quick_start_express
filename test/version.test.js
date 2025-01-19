import packageJson from "../package.json";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
import { expect } from "@jest/globals";

const exec = promisify(execCallback);

describe("Version Command", () => {
    test("package.json has version", () => {
        expect(packageJson).toHaveProperty("version");
        expect(typeof packageJson.version).toEqual("string");
        expect(packageJson.version.length > 0).toEqual(true);
    });
    test("--version", async () => {
        const { stdout, stderr } = await exec("node bin/index.js --version");
        expect(stdout).toEqual(`v${packageJson.version}\n`);
        expect(stderr).toEqual("");
    });
    test("-v", async () => {
        const { stdout, stderr } = await exec("node bin/index.js -v");
        expect(stdout).toEqual(`v${packageJson.version}\n`);
        expect(stderr).toEqual("");
    });
});
