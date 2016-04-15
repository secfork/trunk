var http = require('http');
var path = require('path');
var app = require('../../restful/app');
var appconfig = require('./appconfig/config');


// 初始化日志记录
require('../utils/logger')
    .use(require('./appconfig/log4js-default'), 'private-api');

// app.use("/live", require('./routers/live'));
// app.use("/historian", require('./routers/historian'));
// app.use("/alarm", require('./routers/alarm-private'));
// app.use("/info",require('./routers/info.js'));
// app.use("/", require('./routers/msgcenter'));
// app.use("/",require('./routers/account'));
/// catch 404 and forward to error handler
app.use(bodyParser.json({limit:'10mb'}));

app.use("/ab/ac" , function(req , res){
	res.json({a : 1})
})

app.use("/ab/ad" , function(req , res){
	res.json({a : 2})
})

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

    http.createServer(app).listen(port, function(){
        console.log("pid",process.pid);
        console.log("Express server listening on port " + port);
        logger.info("===================================================");
        logger.info("Start Private RESTful API Service.")
        logger.info('PID %s.', process.pid);
        logger.info('Server listening on port %s.', port);
        logger.info('Ready.');
    });
}

init();
