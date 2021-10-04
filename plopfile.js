const fs = require('fs');

module.exports = function(plop) {
    plop.setHelper('formatPath', (txt) => txt.replace(/\/\//g, '/'));

    fs.readdirSync('./templates').forEach(file => {
        console.log('file', file)
        plop.setGenerator(file, require(`./templates/${file}`))
    });
}
