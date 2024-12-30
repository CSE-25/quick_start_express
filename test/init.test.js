const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const tempDir = path.join(__dirname, 'temp');
const stripAnsi = require('strip-ansi');

function initTempDirectory() {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);
}

function clearTempDirectory() {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
}

function traverseDirectory(dirName, hash) {
    const files = fs.readdirSync(dirName);

    for (const file of files) {
        const filePath = path.join(dirName, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, hash);
        } else {
            const data = fs.readFileSync(filePath);
            hash.update(data);
        }
    }
}

// Ignore node_modules and package-lock.json
// and compute the SHA256 hash.
function computeSHA256Hash(dirName) {
    const hash = crypto.createHash('sha256');
    const files = fs.readdirSync(dirName);

    for (const file of files) {
        if (file === 'node_modules' || file === 'package-lock.json' || file === 'package.json') {
            continue;
        }
        const filePath = path.join(dirName, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, hash);
        } else {
            const data = fs.readFileSync(filePath);
            hash.update(data);
        }
    }

    return hash.digest('hex');
}

describe('init', () => {
    beforeEach(() => {
        initTempDirectory();
    });    

    afterAll(() => {
        clearTempDirectory();
    });

    test('no templates passed, should default to basic', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'basic'));
        await exec(`node ../../bin/index.js init`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    });

    test('basic', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'basic'));
        await exec(`node ../../bin/index.js init -t basic`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    });

    test('express_pg_sequelize', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'express_pg_sequelize'));
        await exec(`node ../../bin/index.js init -t express_pg_sequelize`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    }, 10000);

    test('express_mysql', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'express_mysql'));
        await exec(`node ../../bin/index.js init -t express_mysql`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    }, 10000);

    test('invalid template name passed', async () => {
        const { stdout, stderr } = await exec(`node ../../bin/index.js init -t invalid_template`, { cwd: tempDir });
        expect(stripAnsi(stderr)).toContain(`Template invalid_template does not exist. To see available templates use "qse list".`);
    });

    test('invalid template name: >214 characters', async () => {
        const longName = 'a'.repeat(215);
        const { stderr } = await exec(`node ../../bin/index.js init -n ${longName}`, { cwd: tempDir });
        expect(stripAnsi(stderr)).toContain('Invalid package name: name can no longer contain more than 214 characters. Please provide a valid package name.');
    });

    test('invalid template name: contains uppercase characters', async () => {
        const { stderr } = await exec(`node ../../bin/index.js init -n InvalidName`, { cwd: tempDir });
        expect(stripAnsi(stderr)).toContain('Invalid package name: name can no longer contain capital letters. Please provide a valid package name.');
    });

    test('invalid template name: contains non URL friendly charcters', async () => {
        const { stderr } = await exec(`node ../../bin/index.js init -n "#invalid name"`, { cwd: tempDir });
        expect(stripAnsi(stderr)).toContain('Invalid package name: name can only contain URL-friendly characters. Please provide a valid package name.');
    });

    test('valid template name: <= 214 characters', async () => {
        const validName = 'a'.repeat(214);
        await exec(`node ../../bin/index.js init -t basic -n ${validName}`, { cwd: tempDir });

        const packageJsonPath = path.join(tempDir, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        expect(packageJson.name).toBe(validName);
    });

    test('valid template name: lowercase only', async () => {
        const validName = 'validname';
        await exec(`node ../../bin/index.js init -n ${validName}`, { cwd: tempDir });

        const packageJsonPath = path.join(tempDir, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        expect(packageJson.name).toBe(validName);
    });

    test('valid template name: URL friendly characters', async () => {
        const validName = 'valid-name';
        await exec(`node ../../bin/index.js init -n ${validName}`, { cwd: tempDir });

        const packageJsonPath = path.join(tempDir, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        expect(packageJson.name).toBe(validName);
    });
});
