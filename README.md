[![npm latest published version](https://img.shields.io/npm/v/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![npm downloads last 18 months](https://img.shields.io/npm/d18m/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![npm last updated](https://img.shields.io/npm/last-update/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![build status](https://img.shields.io/github/actions/workflow/status/CSE-25/quick_start_express/runJestTests.yml)]

# Quick Start Express

A simple CLI tool to generate Express servers from multiple available templates. [View on NPM](https://www.npmjs.com/package/quick_start_express)

# Commands

## Version

View current tool version.

```bash
qse -v
```

```bash
qse --version
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/2dc11693-d0e0-4900-a5fb-876c87806570" width="800px"/>
</div>

## List

List all available commands and options.

```bash
qse list
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/c4c839f4-761a-479c-8b1f-4ca53eab3458" width="800px"/>
</div>

## Init

Initialize a new Express.js server.

```bash
qse init
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/7e246ad7-add4-479a-9970-e3d79e8480ac" width="800px"/>
</div>

## Clear

Clear Directory.

```bash
qse clear
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/f886fc9f-7378-4904-8177-e7c0842becb6" width=600px"/>
</div>

<br>

# Install Package from npm

1. Run the following command in the terminal to install the required `node` packages:

```bash
npm i -g quick_start_express
```

2. Run any qse commands in the target directory such as `qse init`, `qse clear`, `qse -v` ... etc.

# Contributing

Follow the guidelines in [CONTRIBUTING.md](https://github.com/CSE-25/quick_start_express/tree/main/docs/CONTRIBUTING.md) to contribute to the project.

# Local Development Environment Setup

### Install Node.js

1. Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Verify the installation by running the following command in the terminal:

   ```bash
   node -v
   ```

   The version of Node.js should be displayed.

### Install node packages.

1. Run the following command in the terminal to install the required `node` packages:

   ```bash
   npm i
   ```

### Run the package.

To test the CLI tool locally, you need to link the package. Use a separate testing directory to avoid modifying files in the root directory of `quick_start_express`.

1. **Link the Package in the Main Directory**: In the `quick_start_express` root directory, run:

   ```bash
   npm link
   ```

2. **Create a Testing Directory**: In the `quick_start_express` root directory, create a `qse-test` directory:

   ```bash
   mkdir qse-test
   cd qse-test
   ```

3. **Link `qse` in the Testing Directory**: In the testing directory, run:

   ```bash
   npm link qse
   ```
   
4. **Run `qse` Commands**: Now, you can execute any `qse` commands in the testing directory, such as:

   ```bash
   qse init
   qse clear
   qse -v
   ```

> [!Note] 
> Running `npm link qse` in the root directory may modify `package.json`. Always use a separate testing directory to avoid this.

**Clean-Up**: After testing, you may delete the testing directory if it’s no longer needed.

## Running Tests

To execute the tests, navigate to the root directory of the `quick_start_express` project where all dependencies are installed, and run the following command:

```bash
npm test
```
## Developers

- [Abhinav Ramakrishnan](https://github.com/Abhinav-ark)
- [Ashwin Narayanan S](https://ashrockzzz2003.github.io/portfolio)
