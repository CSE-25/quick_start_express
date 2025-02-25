[![npm latest published version](https://img.shields.io/npm/v/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![npm downloads last 18 months](https://img.shields.io/npm/d18m/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![npm last updated](https://img.shields.io/npm/last-update/quick_start_express)](https://www.npmjs.com/package/quick_start_express)
[![build status](https://img.shields.io/github/actions/workflow/status/CSE-25/quick_start_express/runTests.yml)](https://github.com/CSE-25/quick_start_express)

# Quick Start Express

<a href="https://cse-25.github.io/quick_start_express/"> <img src="https://img.shields.io/badge/Explore%20Docs-Quick%20Start%20Express-blueviolet?style=for-the-badge&logo=rocket" alt="Quick Start Express Documentation"/> </a>

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

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/c6a160dc-5d82-424a-a7fd-4e95b538c2a5" width="800px"/>
</div>

## List

List all available commands and options.

```bash
qse list
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/0223d0e0-e597-424c-8f22-d4723ab9a563" width="800px"/>
</div>

## Init

### Initialize a new Express.js server.

Run the below command after installing the tool in the directory in which you want the template to be created.

```bash
qse init -t <template-name>
```

Select a template

<div align="center">
   <img src="https://github.com/user-attachments/assets/08f2cf16-0de5-456a-8fc3-00ca295ff142" width="800px"/>
</div>

Answer a few questions to customize your template

<div align="center">
   <img src="https://github.com/user-attachments/assets/b0278466-022b-469b-83ef-5f692f2b1bd9" width="800px"/>
</div>

#### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/d965b1c9-e872-4fda-8f6c-096e1891ca43" width="800px"/>
</div>

### Initialize an Express.js server template (directly with flags).

```bash
qse init -t template_name
```

#### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/84e2fc79-9b88-4817-baf4-56845d5ee756" width="800px"/>
</div>

### Initialize with a Docker Compose file and Dockerfile.

```bash
qse init -t template_name --docker-compose
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/e9147722-5b7f-4add-a321-7089e016e125" width="800px"/>
</div>

### Initialize without nodemon.

```bash
qse init -t template_name --remove-nodemon
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/279b2de6-4360-4399-aa98-cd9d17ca330f" width="800px"/>
</div>

### Initialize without installation of dependencies.

Initialize a new Express.js server without installing dependencies.

```bash
qse init template_name --remove-deps
```

### Output

<div align="center">
   <img src="https://github.com/user-attachments/assets/88619fba-ebcb-4a27-bc10-688f4edf1861" width="800px"/>
</div>

### Customize the Generated Server App Name

Set a custom name for your generated Express server application during initialization.

```bash
qse init -t template_name -n app_name
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
   <img src="https://github.com/user-attachments/assets/74d61468-5bc9-42bf-8ecb-9cb435ac2a9b" width=600px"/>
</div>

<br>

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
- [Adithya Menon R](https://github.com/adithya-menon-r)
- [Phuong Thuy Nguyen](https://github.com/irisgranger)
- [Abhinav Bansal](https://github.com/Abhinav-Bansal751)
- [Guilherme Almeida Lopes](https://github.com/alguiguilo098)
- [Nitansh Shankar](https://github.com/BIJJUDAMA)
- [Priyansh Narang](https://github.com/priyansh-narang2308)
- [André Felipe Mireski](https://github.com/afmireski)
