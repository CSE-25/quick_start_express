---
next: false
prev: false
---

<script>
import { templates } from '../bin/configs';

export default {
    data() {
        return {
            templates: templates,

            selectedTemplate: "",
            packageName: "",
            removeNodemon: false,
            removeDeps: false,
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

            return command
        },
        validatePackageName() {
            let err = ""

            if (this.packageName.length > 214) {
                err = "Package name must have less than or equal to 214 characters."
            } else if (/[ #%]/.test(this.packageName)) {
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

## Select a template
Select a template. If a template is not provided, by default, the basic template is installed.
<div>
    <div v-for="(val, key) in templates">
        <input type="radio" :id="key" :value="key" v-model="selectedTemplate">
        <label :for="key">{{key}}</label>
    </div>
</div>

## Exclude nodemon
By default, nodemon is added as a dev dependency. Add this flag if you do not want hot reloading with nodemon.
<div>
    <input type="checkbox" id="remove-nodemon" v-model="removeNodemon">
    <label for="remove-nodemon">Remove nodemon</label>
</div>

## Exclude dependencies
By default, all dependencies are installed along with your package. Add this flag if you do not want to install the dependencies.
<div>
    <input type="checkbox" id="remove-deps" v-model="removeDeps">
    <label for="remove-deps">Remove dependencies</label>
</div>

## Package name
Provide a package name. By default, the template name becomes the package name.
<div>
    <input type="text" id="package-name" v-model="packageName" placeholder="Package Name">
    <p class="error-message" v-if="validatePackageName()">{{validatePackageName()}}</p>
</div>

## Command
Once you have made your selections, copy this command and paste it in your terminal at the directory where you want the project to be created.
```shell-vue
{{generateCommand()}}
```

<style>
input[type="text"] {
    background-color: #161618;
    width: 60%;
    min-width: 200px;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

input[type="text"]:hover {
    border-color: #a8b1ff;
}

input[type="text"]:focus {
    border-color: #a8b1ff;
}

input[type="text"]::placeholder {
    color: grey;
}

.error-message {
    color: red;
}

label {
    margin-bottom: 0.5rem;
    display: inline-block;
}
</style>