var https = require('https');
var path = require('path');
var app = require('../../restful/app');
var appconfig = require('./appconfig/config');
var fs = require('fs');

// initialize database connections
require('./server/init_db_conn');

// 初始化日志记录
require('../utils/logger')
    .use(require('./appconfig/log4js-default'), 'json');



var base_url="/" + appconfig.version + "/" + appconfig.proto;

// initialize routers
// app.use(base_url , require('./routers/authorization'));

// all for underline middlewares
// app.all(base_url+"/*", require('./server/all'));

// api middlewares
// app.use(base_url, require('./routers/account'));
// app.use(base_url, require('./routers/stream'));
// app.use(base_url, require('./routers/devlink'));
// app.use(base_url, require('./routers/live'));
// app.use(base_url, require('./routers/status'));
// app.use(base_url, require('./routers/historian'));
// app.use(base_url, require('./routers/info'));
// app.use(base_url, require('./routers/alarm'));
app.use(base_url, require('./routers/syalias'));

/// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//////////////////////////////////////////////////////////////////////
/// init services
///
function init(){
    //var sconfig = ServiceConfig.loadConfig();
    var port = appconfig.port;
    var options = {
        key: fs.readFileSync(path.join(appconfig.cert_folder, appconfig.key)),
        cert: fs.readFileSync(path.join(appconfig.cert_folder, appconfig.cert))
    };

    https.createServer(options, app).listen(port, function(){
        console.log('pid', process.pid);
        console.log('Express server listening on port ' + port);
    });
}

init();
