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
    })

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
        const { stdout, stderr } = await exec(`node ../../bin/index.js init -t invalid_name`, { cwd: tempDir });
        expect(stripAnsi(stderr)).toContain(`Template invalid_name does not exist. To see available templates use "qse list".`);
    });
});