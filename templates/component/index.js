const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());

const prompts = [
    {
        type: 'input',
        name: 'name',
        message: 'enter component name',
        validate: (input) => input.length > 2 ? true : 'name must be at least 3 characters',
    },
    {
        type: 'input',
        name: 'outputPath',
        message: 'enter path to where component should be generated',
        default: 'src/components'
    },
];



module.exports = {
    prompts,
    actions: [{
        type: 'addMany',
        base: `templates/component/`,
        destination: `${appDirectory}/{{formatPath outputPath}}/{{pascalCase name}}`,
        templateFiles: 'templates/component/*.hbs',
    }],
}
