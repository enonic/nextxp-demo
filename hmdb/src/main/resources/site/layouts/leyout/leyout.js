var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');

var view = resolve('./leyout.html');

exports.get = function(req) {
    var component = portal.getComponent();

    log.info("Leyout comp: " + JSON.stringify(component, null, 4));

    var model = {
        ledroit: component.regions["ledroit"],
        lagauche: component.regions["lagauche"]
    };

    log.info("Leyout model: " + JSON.stringify(model, null, 4));

    return {
        body: thymeleaf.render(view, model),
        contentType: 'text/html'
    };
}
