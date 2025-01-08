[![npm latest published version](https://img.shields.io/npm/v/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![npm downloads last 18 months](https://img.shields.io/npm/d18m/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![npm last updated](https://img.shields.io/npm/last-update/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![build status](https://img.shields.io/github/actions/workflow/status/CSE-25/quick_start_express/runJestTests.yml)](https://github.com/CSE-25/quick_start_express)

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
   <img src="https://github.com/user-attachments/assets/d2f187b2-ec24-4e09-8814-3ae928447af6" width="800px"/>
</div>

## List

List all available commands and options.

```bash
qse list
```


### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/6f36f0e1-c714-4728-bd81-844b8104fe43" width="800px"/>
</div>

### Output 

<div align="center">
   <img src="![image](https://github.com/user-attachments/assets/d8832389-5fba-4be8-bc14-c29d32fee878)
" width="800px"/>
</div>

## Init

### Initialize a new Express.js server.

```bash
qse init
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/84e2fc79-9b88-4817-baf4-56845d5ee756" width="800px"/>
</div>

### Initialize without nodemon.

```bash
qse init --remove-nodemon
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/279b2de6-4360-4399-aa98-cd9d17ca330f" width="800px"/>
</div>


### Initialize without installation of dependencies.

Initialize a new Express.js server without installing dependencies.

```bash
qse init --remove-deps
```


### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/6ad96031-ff06-469f-8ec0-319d812558fa" width="800px"/>
</div>

### Customize the Generated Server App Name

Set a custom name for your generated Express server application during initialization.

```bash
qse init -t basic -n app_name
```
### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/110671e5-326b-4d72-a595-2ff62d5dfde8" width="800px"/>
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
## Core Contributors

- [Abhinav Ramakrishnan](https://github.com/Abhinav-ark)
- [Ashwin Narayanan S](https://ashrockzzz2003.github.io/portfolio)

## Contributors

- [Harish G M](https://github.com/GMHarish285)
- [Kiran Rajeev](https://github.com/KiranRajeev-KV)
- [Adripo](https://github.com/adripo)
- [Akshay K S](https://github.com/akshayks13)
- [Jayadev D](https://github.com/FLASH2332)
- [K Venkatesh](https://github.com/venkatesh21bit)
- [Vaibav](https://github.com/vaibav03)
- [Pavan Prakash K](https://github.com/PavanCodes05)
- [Phuong Thuy Nguyen](https://github.com/irisgranger)
- [Abhinav Bansal](https://github.com/Abhinav-Bansal751)
- [Guilherme Almeida Lopes](https://github.com/alguiguilo098)
- [Nitansh Shankar](https://github.com/BIJJUDAMA)
- [Priyansh Narang](https://github.com/priyansh-narang2308)
