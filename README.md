# fastify-postgraphile

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  ![CI workflow](https://github.com/alemagio/fastify-postgraphile/workflows/CI%20workflow/badge.svg)

`fastify-postgraphile` enables the use of [Postgraphile](https://www.graphile.org/postgraphile) in a Fastify application.

Supports Fastify versions `3.x`

## Install
```
npm i fastify-postgraphile
```

## Usage

### Middleware mode

This is the suggested way to work and the only one directly implemented by `postgraphile`.

```js
const fastify = require('fastify')()

fastify.register(require('fastify-postgraphile'), {
  pool: {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432
  },
  schemas: 'public',
  middleware: true // default
  postgraphileOptions: {
    // all the options you can pass to the postgraphile function
  }
})

fastify.listen(3000)
```

### Non middleware mode

Require `fastify-postgraphile` and register it as any other plugin, it will add a `graphql` reply decorator.  
Consider that this is a mode with no built-in routes, you only have a reply decorator already attached to Postgraphile.

```js
const fastify = require('fastify')()

fastify.register(require('fastify-postgraphile'), {
  pool: {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432
  },
  schemas: 'public',
  middleware: false
})

fastify.get('/', async (req, reply) => {
  return reply.graphql(req.body.query, req.body.variables)
})

fastify.listen(3000)
```

# Options

* **pool**: accepts a configuration object for the `pg` connection (see [doc](https://node-postgres.com/features/connecting))
* **schemas**: accepts `string` or `string[]` containing the schemas you want to connect to
* **contextOptions**: see Postgraphile [doc](https://www.graphile.org/postgraphile/usage-schema/#api-withpostgraphilecontextoptions-callback)
* **middleware**: when `true` it enables the default mode of Postgraphile, this is the default configuration and the one supported by Postgraphile
* **postgraphileOptions**: see Postgraphile [doc](https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options) (working only in `middleware` mode)

## Acknowledgements

The code is a port for Fastify of [`postgraphile`](https://www.graphile.org/postgraphile).

## License

Licensed under [MIT](./LICENSE).<br/>
[`postgraphile` license](https://github.com/graphile/postgraphile/blob/v4/LICENSE.md)
