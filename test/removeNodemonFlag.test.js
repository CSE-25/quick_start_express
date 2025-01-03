import path from 'node:path';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from "url";
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "temp");

function initTempDirectory() {
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  mkdirSync(tempDir);
}

function clearTempDirectory() {
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function readPackageJson() {
  const packageJsonPath = path.join(tempDir, 'package.json');
  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  return JSON.parse(packageJsonContent);
}

describe('init with --remove-nodemon flag', () => {
  beforeEach(() => {
    initTempDirectory();
  });

  afterAll(() => {
    clearTempDirectory();
  });

  test('no template passed, should default to basic template without nodemon', async () => {
    await exec('node ../../bin/index.js init --remove-nodemon', { cwd: tempDir });
    const packageJson = readPackageJson();

    expect(packageJson.scripts.start).not.toContain('nodemon');
    expect(packageJson.scripts.dev).toBeUndefined();

    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies).not.toHaveProperty('nodemon');
    }
  }, 10000);

  test('basic', async () => {
    await exec('node ../../bin/index.js init -t basic --remove-nodemon', { cwd: tempDir });
    const packageJson = readPackageJson();

    expect(packageJson.scripts.start).not.toContain('nodemon');
    expect(packageJson.scripts.dev).toBeUndefined();

    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies).not.toHaveProperty('nodemon');
    }
  }, 10000);

  test('express_pg_sequelize', async () => {
    await exec('node ../../bin/index.js init -t express_pg_sequelize --remove-nodemon', { cwd: tempDir, });
    const packageJson = readPackageJson();

    expect(packageJson.scripts.start).not.toContain('nodemon');
    expect(packageJson.scripts.dev).toBeUndefined();

    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies).not.toHaveProperty('nodemon');
    }
  }, 10000);

  test('express_mysql', async () => {
    await exec('node ../../bin/index.js init -t express_mysql --remove-nodemon', { cwd: tempDir, });
    const packageJson = readPackageJson();

    expect(packageJson.scripts.start).not.toContain('nodemon');
    expect(packageJson.scripts.dev).toBeUndefined();

    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies).not.toHaveProperty('nodemon');
    }
  }, 10000);

  test('express_oauth_microsoft', async () => {
    await exec('node ../../bin/index.js init -t express_oauth_microsoft --remove-nodemon', { cwd: tempDir, });
    const packageJson = readPackageJson();

    expect(packageJson.scripts.start).not.toContain('nodemon');
    expect(packageJson.scripts.dev).toBeUndefined();

    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies).not.toHaveProperty('nodemon');
    }
  }, 10000);
});
