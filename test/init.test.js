import { createHash } from "node:crypto";
import path from "node:path";
import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
} from "node:fs";
import { fileURLToPath } from "url";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
import stripAnsi from "strip-ansi";
import { expect, jest } from "@jest/globals";
import { templates } from "../bin/configs.js";

const exec = promisify(execCallback);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "temp");

function readPackageJson() {
    const packageJsonPath = path.join(tempDir, "package.json");
    const packageJsonContent = readFileSync(packageJsonPath, "utf8");
    return JSON.parse(packageJsonContent);
}

function hasNodemon() {
    const packageJson = readPackageJson();
    if (!packageJson.scripts) {
        return false;
    }

    if (!packageJson.scripts.dev) {
        return false;
    }

    if (!packageJson.scripts.dev.includes("nodemon")) {
        return false;
    }

    if (!packageJson.devDependencies) {
        return false;
    }

    if (!packageJson.devDependencies.nodemon) {
        return false;
    }

    return true;
}

function verifyPackageName(expectedName) {
    const packageJson = readPackageJson();
    expect(packageJson.name).toBe(expectedName);
}

function initTempDirectory() {
    if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true });
    }
    mkdirSync(tempDir);
}

function clearTempDirectory() {
    if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true });
    }
}

function nodeModulesExist() {
    return existsSync(path.join(tempDir, "node_modules"));
}

function traverseDirectory(dirName, hash) {
    const files = readdirSync(dirName);

    for (const file of files) {
        const filePath = path.join(dirName, file);
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, hash);
        } else {
            const data = readFileSync(filePath);
            hash.update(data);
        }
    }
}

// Ignore node_modules and package-lock.json
// and compute the SHA256 hash.
function computeSHA256Hash(dirName) {
    const hash = createHash("sha256");
    const files = readdirSync(dirName);

    const ignoreFilesList = [
        "node_modules",
        "package-lock.json",
        "package.json",
        "docker-compose.yml",
        "Dockerfile",
    ];

    for (const file of files) {
        if (ignoreFilesList.includes(file)) {
            continue;
        }
        const filePath = path.join(dirName, file);
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, hash);
        } else {
            const data = readFileSync(filePath);
            hash.update(data);
        }
    }

    return hash.digest("hex");
}

function verifyDockerFiles() {
    const dockerComposePath = path.join(tempDir, "docker-compose.yml");
    const dockerfilePath = path.join(tempDir, "Dockerfile");

    const existsBothDockerfiles =
        existsSync(dockerComposePath) && existsSync(dockerfilePath);

    expect(existsBothDockerfiles).toBe(true);
}

// Verify if installing dependencies is happening by default
// along with nodemon in package.json by default.
describe("normal init with default settings", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    // TODO: Add test for cases where `inquirer` prompts are used for this.

    Object.entries(templates).forEach(([templateName, _]) => {
        test(`${templateName} with nodemon and deps installed`, async () => {
            const originalHash = computeSHA256Hash(
                path.join(__dirname, "..", "templates", templateName),
            );
            await exec(`node ../../bin/index.js init -t ${templateName}`, {
                cwd: tempDir,
            });
            const commandHash = computeSHA256Hash(tempDir);
            expect(commandHash).toEqual(originalHash);

            expect(hasNodemon()).toBe(true);
            expect(nodeModulesExist()).toBe(true);
        }, 25000);
    });
});

describe("init --remove-deps", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    // TODO: Add test for cases where `inquirer` prompts are used for this.

    Object.entries(templates).forEach(([templateName, _]) => {
        test(`${templateName} with nodemon without deps installed`, async () => {
            const originalHash = computeSHA256Hash(
                path.join(__dirname, "..", "templates", templateName),
            );
            await exec(
                `node ../../bin/index.js init -t ${templateName} --remove-deps`,
                {
                    cwd: tempDir,
                },
            );
            const commandHash = computeSHA256Hash(tempDir);
            expect(commandHash).toEqual(originalHash);

            expect(hasNodemon()).toBe(true);
            expect(nodeModulesExist()).toBe(false);
        }, 25000);
    });
});

// Not installing dependencies as it takes time and is already tested above.
describe("init with custom template name without installing deps", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    test("invalid template name passed", async () => {
        const { stdout, stderr } = await exec(
            `node ../../bin/index.js init -t invalid_template --remove-deps`,
            { cwd: tempDir },
        );
        expect(stripAnsi(stderr)).toContain(
            `Template invalid_template does not exist. To see available templates use "qse list".`,
        );
    });

    test("invalid template name: >214 characters", async () => {
        const longName = "a".repeat(215);
        const { stderr } = await exec(
            `node ../../bin/index.js init -t basic -n ${longName} --remove-deps`,
            { cwd: tempDir },
        );
        expect(stripAnsi(stderr)).toContain(
            "Invalid package name: name can no longer contain more than 214 characters. Please provide a valid package name.",
        );
    });

    test("invalid template name: contains uppercase characters", async () => {
        const { stderr } = await exec(
            `node ../../bin/index.js init -t basic -n InvalidName --remove-deps`,
            { cwd: tempDir },
        );
        expect(stripAnsi(stderr)).toContain(
            "Invalid package name: name can no longer contain capital letters. Please provide a valid package name.",
        );
    });

    test("invalid template name: contains non URL friendly characters", async () => {
        const { stderr } = await exec(
            `node ../../bin/index.js init -t basic -n "#invalid name%" --remove-deps`,
            { cwd: tempDir },
        );
        expect(stripAnsi(stderr)).toContain(
            "Invalid package name: name can only contain URL-friendly characters. Please provide a valid package name.",
        );
    });

    test("valid template name: <= 214 characters", async () => {
        const validName = "a".repeat(214);
        await exec(
            `node ../../bin/index.js init -t basic -n ${validName} --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        verifyPackageName(validName);
    }, 25000);

    test("valid template name: lowercase only", async () => {
        const validName = "validname";
        await exec(
            `node ../../bin/index.js init -t basic -n ${validName} --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        verifyPackageName(validName);
    }, 25000);

    test("valid template name: URL friendly characters", async () => {
        const validName = "valid-name";
        await exec(
            `node ../../bin/index.js init -t basic -n ${validName} --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        verifyPackageName(validName);
    }, 25000);

    // TODO: Add test for cases where `inquirer` prompts are used for this.
});

// Not installing dependencies for faster tests.
describe("init without nodemon option without installing deps.", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    // TODO: Add test for cases where `inquirer` prompts are used for this.

    Object.entries(templates).forEach(([templateName, _]) => {
        test(`${templateName} without nodemon`, async () => {
            await exec(
                `node ../../bin/index.js init -t ${templateName} --remove-nodemon --remove-deps`,
                { cwd: tempDir },
            );
            const packageJson = readPackageJson();

            expect(packageJson.scripts.start).not.toContain("nodemon");
            expect(packageJson.scripts.dev).toBeUndefined();

            if (packageJson.devDependencies) {
                expect(packageJson.devDependencies).not.toHaveProperty(
                    "nodemon",
                );
            }
        }, 25000);
    });
});

describe("init with docker-compose without cache service and db", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    Object.entries(templates).forEach(([templateName, _]) => {
        test(`${templateName} with docker configuration`, async () => {
            const originalHash = computeSHA256Hash(
                path.join(__dirname, "..", "templates", templateName),
            );
            await exec(
                `node ../../bin/index.js init -t ${templateName} --remove-deps --docker-compose --skip-db --cache-service skip`,
                {
                    cwd: tempDir,
                },
            );

            const commandHash = computeSHA256Hash(tempDir);
            expect(commandHash).toEqual(originalHash);
            expect(hasNodemon()).toBe(true);
            expect(nodeModulesExist()).toBe(false);

            verifyDockerFiles();
        }, 25000);
    });
});

// TODO: Add tests for init with docker-compose with only cache service specified.
// TODO: Add tests for init with docker-compose with only db enabled.

const mockAskSelection = jest.fn();
const mockAskConfirmation = jest.fn();

jest.unstable_mockModule("../bin/util/question/inquirer.js", () => ({
    askConfirmation: mockAskConfirmation,
    askSelection: mockAskSelection,
}));

// Import the module after mocking
const { initCommand } = await import("../bin/init.js");

describe("init with docker-compose with cache service and db", () => {
    beforeEach(() => {
        jest.resetModules();
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
        jest.clearAllMocks();
    });

    Object.entries(templates).forEach(([templateName, _]) => {
        test(`${templateName} with docker configuration, cache and DB`, async () => {
            jest.spyOn(process, "cwd").mockReturnValue(tempDir);

            const originalHash = computeSHA256Hash(
                path.join(__dirname, "..", "templates", templateName),
            );

            mockAskConfirmation.mockResolvedValueOnce(true);
            mockAskConfirmation.mockResolvedValueOnce(true);
            mockAskSelection.mockResolvedValueOnce("redis:latest");

            await initCommand({
                template: templateName,
                dockerCompose: true,
                removeDeps: true,
            });

            const commandHash = computeSHA256Hash(tempDir);
            expect(commandHash).toEqual(originalHash);
            expect(hasNodemon()).toBe(true);
            expect(nodeModulesExist()).toBe(false);

            verifyDockerFiles();
        }, 25000);
    });
});
