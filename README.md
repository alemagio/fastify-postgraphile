# fastify-postgraphile

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  ![CI workflow](https://github.com/alemagio/fastify-postgraphile/workflows/CI%20workflow/badge.svg)

`fastify-postgraphile` enables the use of [Postgraphile](https://www.graphile.org/postgraphile) in a Fastify application.

Supports Fastify versions `3.x`

## Install
```
npm i fastify-postgraphile
```

## Usage
Require `fastify-postgraphile` and register it as any other plugin, it will add a `graphql` reply decorator.
```js
const fastify = require('fastify')()

fastify.register(require('fastify-postgraphile'), {
  poolConfig: {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432
  },
  schemas: 'public'
})

fastify.get('/', async (req, reply) => {
  return reply.graphql(req.body.query, req.body.variables)
})

fastify.listen(3000)
```

## Acknowledgements

The code is a port for Fastify of [`postgraphile`](https://www.graphile.org/postgraphile).

## License

Licensed under [MIT](./LICENSE).<br/>
[`postgraphile` license](https://github.com/graphile/postgraphile/blob/v4/LICENSE.md)
