var generators = require('yeoman-generator');

var copy;

module.exports = generators.Base.extend({
    initializing: function() {
        copy = copy_file.bind(this);
    },

    prompting: function() {
        var done = this.async();
        this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'Project name (All non-alpha numeric characters will be replaced with dashes)',
            default : this.appname // Default to current folder name

        },{
            type    : 'input',
            name    : 'description',
            message : 'Project description'

        },{
            type    : 'input',
            name    : 'author',
            message : 'Author (Firstname Lastname <email> (url)'

        },{
            type    : 'input',
            name    : 'gitrepo',
            message : 'GitHub repository URL'

        },{
            type    : 'input',
            name    : 'license',
            message : 'License',
            default : 'MIT'

        },{
            type    : 'input',
            name    : 'apiendpoint',
            message : 'Prismic API endpoint'

        },{
            type    : 'input',
            name    : 'accesstoken',
            message : 'Prismic access token'

        },{
            type    : 'input',
            name    : 'clientid',
            message : 'Prismic client ID'

        },{
            type    : 'input',
            name    : 'clientsecret',
            message : 'Prismic client secret'

        }], function (answers) {
            answers.name = answers.name.replace(/\W+/g, '-');
            answers.name = answers.name.toLowerCase();

            this.config.set('projectname', answers.name);
            this.config.set('projectdesc', answers.description);
            this.config.set('author', answers.author);
            this.config.set('gitrepo', answers.gitrepo);
            this.config.set('license', answers.license);
            this.config.set('apiendpoint', answers.apiendpoint);
            this.config.set('accesstoken', answers.accesstoken);
            this.config.set('clientid', answers.clientid);
            this.config.set('clientsecret', answers.clientsecret);

            done();
        }.bind(this));
    },

    writing: function() {
        this.mkdir('./app/views/layouts');
        this.mkdir('./app/views/partials');
        this.mkdir('./public/css');
        this.mkdir('./public/images');
        this.mkdir('./public/js');

        copy('dot_env', this.config.getAll(), '.env');
        copy('dot_gitignore', '.gitignore');
        copy('config.json');
        copy('dev.js');
        copy('main.js');
        copy('package.json', this.config.getAll());
        copy('Procfile');
        copy('Procfile_dev');

        copy('README.md', this.config.getAll());
    },

    install: function() {
        this.npmInstall(['nodemon'], { 'saveDev': true });
        this.npmInstall(['prismic-website@0.0.2'], { 'save': true });
    },

    end: function() {
        // TODO: Use chalk
        this.log('');
        this.log("You're all set!");
        this.log('');
        this.log('Start dev server with: npm run dev');
        this.log('');
        this.log('First steps:');
        this.log('    - Add a favicon at ./public/favicon.ico');
        this.log('    - Create route definitions in ./config.json');
        this.log('    - Add route handlers in ./main.js');
        this.log('    - Put templates in ./app/views/');
        this.log('    - Put layouts in ./app/views/layouts/');
        this.log('');
    }
});

function tpl(ctx, file) {
    return ctx.templatePath('../../templates/'+file);
}

function copy_file(file, content, output_file) {
    if (typeof content === 'string') {
        output_file = content;
        content = undefined;
    } else {
        if (typeof output_file === 'undefined') {
            output_file = file;
        }
    }

    if (content) {
        this.fs.copyTpl(
            tpl(this, file),
            this.destinationPath(output_file),
            content
        );
    } else {
        this.fs.copy(
            tpl(this, file),
            this.destinationPath(output_file)
        );
    }
}
