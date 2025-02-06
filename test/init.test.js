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
import { expect } from "@jest/globals";

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
        if (
            ignoreFilesList.includes(file)
        ) {
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

    test("basic with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "basic"),
        );
        await exec(`node ../../bin/index.js init -t basic`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_pg with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg"),
        );
        await exec(`node ../../bin/index.js init -t express_pg`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_pg_sequelize with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg_sequelize"),
        );
        await exec(`node ../../bin/index.js init -t express_pg_sequelize`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_mysql with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_mysql"),
        );
        await exec(`node ../../bin/index.js init -t express_mysql`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_oauth_microsoft with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_oauth_microsoft"),
        );
        await exec(`node ../../bin/index.js init -t express_oauth_microsoft`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_pg_prisma with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg_prisma"),
        );
        await exec(`node ../../bin/index.js init -t express_pg_prisma`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_mongo with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_mongo"),
        );
        await exec(`node ../../bin/index.js init -t express_mongo`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("express_oauth_google with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_oauth_google"),
        );
        await exec(`node ../../bin/index.js init -t express_oauth_google`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);

    test("basic_ts with nodemon", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "basic_ts"),
        );
        await exec(`node ../../bin/index.js init -t basic_ts`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);
    }, 20000);
});

describe("init --remove-deps", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    // TODO: Add test for cases where `inquirer` prompts are used for this.

    test("basic with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "basic"),
        );
        await exec(`node ../../bin/index.js init -t basic --remove-deps`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_pg with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg"),
        );
        await exec(`node ../../bin/index.js init -t express_pg --remove-deps`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_pg_sequelize with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg_sequelize"),
        );
        await exec(
            `node ../../bin/index.js init -t express_pg_sequelize --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_mysql with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_mysql"),
        );
        await exec(
            `node ../../bin/index.js init -t express_mysql --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_oauth_microsoft with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_oauth_microsoft"),
        );
        await exec(
            `node ../../bin/index.js init -t express_oauth_microsoft --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_pg_prisma with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg_prisma"),
        );
        await exec(
            `node ../../bin/index.js init -t express_pg_prisma --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_mongo with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_mongo"),
        );
        await exec(
            `node ../../bin/index.js init -t express_mongo --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("express_oauth_google with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_oauth_google"),
        );
        await exec(
            `node ../../bin/index.js init -t express_oauth_google --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);

    test("basic_ts with nodemon without deps installed", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "basic_ts"),
        );
        await exec(`node ../../bin/index.js init -t basic_ts --remove-deps`, {
            cwd: tempDir,
        });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);

        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(false);
    }, 20000);
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
    }, 20000);

    test("valid template name: lowercase only", async () => {
        const validName = "validname";
        await exec(
            `node ../../bin/index.js init -t basic -n ${validName} --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        verifyPackageName(validName);
    }, 20000);

    test("valid template name: URL friendly characters", async () => {
        const validName = "valid-name";
        await exec(
            `node ../../bin/index.js init -t basic -n ${validName} --remove-deps`,
            {
                cwd: tempDir,
            },
        );
        verifyPackageName(validName);
    }, 20000);

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

    test("basic without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t basic --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_pg without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_pg --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_pg_sequelize without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_pg_sequelize --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_mysql without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_mysql --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_oauth_microsoft without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_oauth_microsoft --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_pg_prisma without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_pg_prisma --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_mongo without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_mongo --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("express_oauth_google without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t express_oauth_google --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);

    test("basic_ts without nodemon", async () => {
        await exec(
            "node ../../bin/index.js init -t basic_ts --remove-nodemon --remove-deps",
            { cwd: tempDir },
        );
        const packageJson = readPackageJson();

        expect(packageJson.scripts.start).not.toContain("nodemon");
        expect(packageJson.scripts.dev).toBeUndefined();

        if (packageJson.devDependencies) {
            expect(packageJson.devDependencies).not.toHaveProperty("nodemon");
        }
    }, 20000);
});

// TODO: Add tests for docker-compose.

function verifyDockerFiles() {
    const dockerComposePath = path.join(tempDir, "docker-compose.yml");
    const dockerfilePath = path.join(tempDir, "Dockerfile");

    const existsBothDockerfiles =
        existsSync(dockerComposePath) && existsSync(dockerfilePath);

    expect(existsBothDockerfiles).toBe(true);
}

// TODO: Add tests for docker-compose.
describe("init --docker-compose", () => {
    beforeEach(() => {
        initTempDirectory();
    });

    afterAll(() => {
        clearTempDirectory();
    });

    test("basic with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "basic"),
        );
        await exec("node ../../bin/index.js init -t basic --docker-compose", {
            cwd: tempDir,
        });

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_pg with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg"),
        );
        await exec(
            "node ../../bin/index.js init -t express_pg --docker-compose --no-db",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_pg_sequelize with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg_sequelize"),
        );
        await exec(
            "node ../../bin/index.js init -t express_pg_sequelize --docker-compose --no-db",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_mysql with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_mysql"),
        );
        await exec(
            "node ../../bin/index.js init -t express_mysql --docker-compose --no-db",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_oauth_microsoft with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_oauth_microsoft"),
        );
        await exec(
            "node ../../bin/index.js init -t express_oauth_microsoft --docker-compose",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_pg_prisma with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_pg_prisma"),
        );
        await exec(
            "node ../../bin/index.js init -t express_pg_prisma --docker-compose --no-db",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_mongo with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_mongo"),
        );
        await exec(
            "node ../../bin/index.js init -t express_mongo --docker-compose --no-db",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("express_oauth_google with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "express_oauth_google"),
        );
        await exec(
            "node ../../bin/index.js init -t express_oauth_google --docker-compose",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);

    test("basic_ts with docker configuration", async () => {
        const originalHash = computeSHA256Hash(
            path.join(__dirname, "..", "templates", "basic_ts"),
        );
        await exec(
            "node ../../bin/index.js init -t basic_ts --docker-compose",
            {
                cwd: tempDir,
            },
        );

        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
        expect(hasNodemon()).toBe(true);
        expect(nodeModulesExist()).toBe(true);

        verifyDockerFiles();
    }, 20000);
});
