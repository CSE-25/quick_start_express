import { exec as execCallback } from "child_process";
import { promisify } from "util";
import { expect } from "@jest/globals";

const exec = promisify(execCallback);

const list = `Available Commands:
- -v, --version: Prints current qse version
- init: Initialize a new Express server.
  (Options: -t, --template <template> - Specify template to use)
  (Options: -n, --name <name> - Specify the name of the package)
  (Options: --docker-compose - Generate a Docker Compose file in the project.)
  (Options: --remove-nodemon - Disable hot-reload support using nodemon)
  (Options: --remove-deps - Do not install the dependencies)
- list: List all available commands and options.
- clear: Clear the directory.

Available Templates:
- basic
- basic_ts
- express_pg
- express_pg_sequelize
- express_mysql
- express_pg_prisma
- express_oauth_microsoft
- express_oauth_google\n`;

describe("List Command", () => {
    test("list", async () => {
        const { stdout, stderr } = await exec("node bin/index.js list");
        expect(stdout).toEqual(list);
        expect(stderr).toEqual("");
    });
});
