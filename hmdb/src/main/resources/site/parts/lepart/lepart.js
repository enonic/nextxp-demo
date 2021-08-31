var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');

var view = resolve('./lepart.html');

exports.get = function(req) {
    var component = portal.getComponent();

    log.info("Lepart comp: " + JSON.stringify(component.config, null, 4));
    return {
        body: thymeleaf.render(view, {}),
        contentType: 'text/html'
    };
}
