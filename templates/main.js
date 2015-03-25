var config          = require('./config.json');
var website         = require('prismic-website');

website.on('ready', function(webserver) {
});

website.init(config, {
    base: __dirname
});
