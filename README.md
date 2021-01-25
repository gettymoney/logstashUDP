# Log4JS - Logstash UDP appender

This is an optional appender for [log4js-node](https://log4js-node.github.io/log4js-node/).
```bash
npm install @log4js-node/logstashudp
```

The logstashUDP appender supports sending log events to a [Logstash](https://www.elastic.co/products/logstash) server. It uses the node.js core UDP support, and so requires no extra dependencies. Remember to call `log4js.shutdown` in your application if you want the UDP socket closed cleanly.

## Configuration

* `type` - `@log4js-node/logstashudp`
* `host` - `string` - hostname (or IP-address) of the logstash server
* `port` - `integer` - port of the logstash server
* `layout` - (optional, defaults to dummyLayout) - used for the message field of the logstash data (see [layouts](https://github.com/log4js-node/log4js-node/blob/master/docs/layouts.md))

## Example
### default config
```javascript
log4js.configure({
  appenders: {
    logstash: {
      type: '@log4js-node/logstashudp',
      host: 'log.server',
      port: 12345
    }
  },
  categories: {
    default: { appenders: ['logstash'], level: 'info' }
  }
});
const logger = log4js.getLogger();
logger.info({ cheese: 'gouda', biscuits: 'hobnob' });
```
This will result in a JSON message being sent to log.server:12345 over UDP, with the following format:
```javascript
{
  'biscuits': 'hobnob',
  'cheese': 'gouda'
}
```
