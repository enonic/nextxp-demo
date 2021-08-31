var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');

var view = resolve('./default.html');

exports.get = function(req) {
    var content = portal.getContent();

    log.info("Default comp: " + JSON.stringify(content.page.config, null, 4));

    var model = {
        main: content.page.regions["main"],
        afterthought: content.page.regions["afterthought"]
    };

    return {
        body: thymeleaf.render(view, model),
        contentType: 'text/html'
    };
}
