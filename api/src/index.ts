import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';
import Surreal from "https://deno.land/x/surrealdb/mod.ts";

const db = new Surreal('http://127.0.0.1:8000/rpc');
try {
  // Signin as a namespace, database, or root user
  await db.signin({
    user: 'root',
    pass: 'root',
  });
  // Select a specific namespace / database
  await db.use('itsg', 'controls');
} catch (e) {
  console.error(`Couldn't connect to the database! Details:`, e);
}

const builder = new SchemaBuilder({});

export class Control {
  id: string;
  title: string;
  description: string;
}

builder.objectType(Control,{
  name: 'Control',
  description: 'An ITSG-33 control',
  fields: (t) => ({
    id: t.exposeString('id', {}),
    title: t.exposeString('title', {}),
    definition: t.exposeString('definition', {}),
  }),
});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string({}),
      },
      resolve: (_, { name }) => `hello, ${name || 'World'}`,
    }),
    controls: t.field({
      type: [Control],
      resolve: async (_, { }, {db}) => {
		    let groups = await db.query('select controlId as id, title, definition from controls where mappings.itsg33.pbmm = true;');
        let [first] = groups
        return first.result
      }
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
  context: {db}
});

serve(yoga, {
  port: 3000,
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});