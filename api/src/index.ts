import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string({}),
      },
      resolve: (_, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

serve(yoga, {
  port: 3000,
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});