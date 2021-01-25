const debug = require('debug')('log4js:logstashUDP');
const dgram = require('dgram');
const util = require('util');

function sendLog(udp, host, port, logObject, logError) {
  debug('Log being sent over UDP');
  let buffer;
  try {
    buffer = Buffer.from(JSON.stringify(logObject));
  } catch (e) {
    debug('Could not serialise log event to JSON', e, logObject);
    logObject.message.data = ['Event could not be serialised to JSON: ' + e.message];
    buffer = Buffer.from(JSON.stringify(logObject));
  }

  udp.send(buffer, 0, buffer.length, port, host, err => {
    if (err) {
      logError(`log4js.logstashUDP - ${host}:${port} Error: ${util.inspect(err)}.`);
    }
  });
}

function logstashUDP(config, layout, logError) {
  const udp = dgram.createSocket('udp4');

  function log(loggingEvent) {
    sendLog(udp, config.host, config.port, layout(loggingEvent), logError);
  }

  log.shutdown = cb => udp.close(cb);

  debug('Appender has been set.');
  return log;
}

function configure(config, layouts, logError = console.error) {
  let layout = layouts.dummyLayout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return logstashUDP(config, layout, logError);
}

module.exports.configure = configure;
