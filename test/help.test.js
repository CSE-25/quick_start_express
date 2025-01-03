import { exec as execCallback } from "child_process";
import { promisify } from "util";
const exec = promisify(execCallback);

const help = `Usage: qse [options] [command]

A simple CLI tool to generate Express servers from multiple available
templates.

Options:
  -v, --version   output the version number
  -h, --help      display help for command

Commands:
  init [options]  Initialize a new Express server.
  list            List all available commands and options.
  clear           Clear the directory.
  help [command]  display help for command\n`;

describe("Help Command", () => {
  test("help", async () => {
    const { stdout, stderr } = await exec("node bin/index.js help");
    expect(stdout).toEqual(help);
    expect(stderr).toEqual("");
  });
  test("--help", async () => {
    const { stdout, stderr } = await exec("node bin/index.js --help");
    expect(stdout).toEqual(help);
    expect(stderr).toEqual("");
  });
  test("-h", async () => {
    const { stdout, stderr } = await exec("node bin/index.js -h");
    expect(stdout).toEqual(help);
    expect(stderr).toEqual("");
  });
});
