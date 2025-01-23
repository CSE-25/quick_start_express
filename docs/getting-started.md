# Getting Started with QSE

Quick Start Express (QSE) is a simple yet powerful CLI tool designed to quickly generate Express servers from multiple templates. It simplifies server setup with customizable configurations including server name, Docker Compose file generation, and more.

## Installation

Install the `quick_start_express` package globally via npm. Run the following command in the terminal:

```shell
npm i -g quick_start_express
```

> **:exclamation: Important:** A global install (with `-g`) is required for `qse` to function.

## Basic Commands

> **:pushpin: Note:** Run the basic `qse` commands in your project directory.

### Version

Check the current installed version of QSE:

```shell
qse -v
```

```shell
qse --version
```

### List

Display all available templates, commands and options:

```shell
qse list
```

### Init

Run the following command in your project directory and answer a series of prompts to create a new Express server:

```shell
qse init
```

#### Direct Initialisation with flags

Use flags along with `qse init` for direct initialisation of an Express server template:

- **Specify a server template:**

    ```shell
    qse init -t <template_name>
    ```

- **Add Docker support:**

    ```shell
    qse init -t <template_name> --docker-compose
    ```

    Includes a `Dockerfile` and `docker-compose.yml` for containerization.

- **Exclude nodemon :**

    ```shell
    qse init -t <template_name> --remove-nodemon
    ```

- **Skip dependency installation:**

    ```shell
    qse init -t <template_name> --remove-deps
    ```

- **Set a custom name for server:**
    ```shell
    qse init -t <template_name> -n <app_name>
    ```

### Clear

Run the following command to delete all the files in the `current working directory`:

```shell
qse clear
```

> **:warning: WARNING:** This action is irreversible and all files in the `cwd` will be deleted.

## License

[GPL 3.0](https://github.com/CSE-25/quick_start_express/blob/main/LICENSE)
