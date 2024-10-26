# Quick Start Express

A simple CLI tool to generate Express servers from multiple available templates. [View on NPM](https://www.npmjs.com/package/quick_start_express)

# Install Package from npm

1. Run the following command in the terminal to install the required `node` packages:

```bash
    npm i -g quick_start_express
```
> ⚠️ **WARNING:** `qse` requires a global install with `-g`. It doesn't work with a local install without `-g`.

2. Run any qse commands in the target directory such as `qse init`, `qse clear`, `qse -v` ... etc. 

# Commands

## Version

View current tool version.

```bash
qse -v
```

```bash
qse --version
```

## List

List all available commands and options.

```bash
qse list
```

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

# Contributing

Follow the guidelines in [CONTRIBUTING.md](https://github.com/CSE-25/quick_start_express/tree/main/.github/CONTRIBUTING.md) to contribute to the project.

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

1. Run the following command in the terminal to start the package:

   ```bash
   npm link # in the quick_start_express directory
   ```

   ```bash
   npm link quick_start_express # in the target directory
   ```

2. Run any qse commands in the target directory such as `qse init`, `qse clear`, `qse -v` ... etc. 

## Developers

- [Abhinav Ramakrishnan](https://github.com/Abhinav-ark)
- [Ashwin Narayanan S](https://ashrockzzz2003.github.io/portfolio)
