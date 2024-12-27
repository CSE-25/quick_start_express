const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const list = `Available Commands:
- -v, --version: Prints current qse version
- init: Initialize a new Express server.
  (Options: -t, --template <template> - Specify template to use)
  (Options: -n, --name <name> - Specify the name of the package)
- list: List all available commands and options.
- clear: Clear the directory.

Available Templates:
- basic
- express_pg_sequelize
- express_mysql\n`

describe('List Command', () => {
    test('list', async () => {
        const { stdout, stderr } = await exec('node bin/index.js list');
        expect(stdout).toEqual(list);
        expect(stderr).toEqual('');
    })
})