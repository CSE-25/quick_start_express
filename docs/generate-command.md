<script>
import { templates } from '../bin/configs';

export default {
    data() {
        return {
            templates: templates,
            selectedTemplate: Object.entries(templates)[0][1].name,
            packageName: "",
            removeNodemon: false,
            removeDeps: false,
            addDockerCompose: false
        }
    },
    methods: {
        generateCommand() {
            let command = "qse init"

            if (this.selectedTemplate) {
                command += ` -t ${this.templates[this.selectedTemplate].name}`
            }

            if (this.packageName && !this.validatePackageName()) {
                command += ` -n ${this.packageName}`
            }

            if (this.removeNodemon) {
                command += " --remove-nodemon"
            }

            if (this.removeDeps) {
                command += " --remove-deps"
            }

            if (this.addDockerCompose) {
                command += " --docker-compose"
            }

            return command
        },
        validatePackageName() {
            let err = ""

            if (this.packageName.length > 214) {
                err = "Package name must have less than or equal to 214 characters."
            } else if (/[^-._~0-9a-zA-Z]/.test(this.packageName)) {
                err = "Package name must not contain non URL friendly characters (%, #, space)."
            } else if (/[A-Z]/.test(this.packageName)) {
                err = "Package name must contain only lower case letters."
            }

            return err
        }
    }
}
</script>

# Generate Command

> [!Important]
> Make sure you have Node.js installed on your system before running the command. You can download it from [nodejs.org](https://nodejs.org/).

## Which template?

Choose a template.

<div class="custom-select">
    <select v-model="selectedTemplate">
        <option disabled value="">Select a template</option>
        <option v-for="(val, key) in templates" :value="val.name">
            {{key}}
        </option>
    </select>
</div>

## Exclude nodemon?

Nodemon is included by default for hot reloading. Check this option if you don't want to include nodemon.

<div class="check">
    <input type="checkbox" id="remove-nodemon" v-model="removeNodemon">
    <label for="remove-nodemon">Exclude nodemon</label>
</div>

## Exclude dependencies?

All dependencies are installed by default. Check this option if you don't want to install them.

<div class="check">
    <input type="checkbox" id="remove-deps" v-model="removeDeps">
    <label for="remove-deps">Exclude dependencies</label>
</div>

## Create Docker Compose file?

Check this option if you want to have a Docker Compose in your project.

<div class="check">
    <input type="checkbox" id="add-docker-compose" v-model="addDockerCompose">
    <label for="add-docker-compose">Add Docker Compose file</label>
</div>

## Package name?

Enter a name for your server app. Default name is `qse-server`.

<div>
    <input type="text" id="package-name" v-model="packageName" placeholder="Package Name">
    <p class="error-message" v-if="validatePackageName()">{{validatePackageName()}}</p>
</div>

## The command

After making your selections, copy the below command and run it in your terminal in the desired directory.

```shell-vue
npm i -g quick_start_express
{{generateCommand()}}
```

<style>

input[type="text"] {
    background-color: #161618;
    width: 100%;
    min-width: 200px;
    padding: 0.75rem 1rem;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 1rem;
    color: #fff;
    transition: border-color 0.2s ease, background-color 0.2s ease;
}

input[type="text"]:hover {
    border-color: #a8b1ff;
    background-color: #1e1e20;
}

input[type="text"]:focus {
    border-color: #a8b1ff;
    background-color: #1e1e20;
}

input[type="text"]::placeholder {
    color: #a8a8a8;
}

.error-message {
    color: red;
}

label {
    margin-bottom: 0.5rem;
    display: inline-block;
}

.custom-select {
    min-width: 352px;
    position: relative;
}

.custom-select select {
    appearance: none;
    width: 100%;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    background-color: #161618;
    font-size: 1rem;
}

.custom-select select:hover {
    border-color: #a8b1ff;
    background-color: #1e1e20;
}

.custom-select select:focus {
    border-color: #a8b1ff;
    background-color: #1e1e20;
}

.custom-select::before,
.custom-select::after {
    --size: 4px;
    content: "";
    position: absolute;
    right: 16px;
    pointer-events: none;
}

.custom-select::before {
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-bottom: var(--size) solid #fff;
    top: 40%;
}

.custom-select::after {
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-top: var(--size) solid #fff;
    top: 55%;
}

.check {
    display: flex;
    align-items: center;
    background-color: #161618;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.check input[type="checkbox"] {
    margin-right: 1rem;
}

.check label {
    margin-bottom: 0;
}

</style>
