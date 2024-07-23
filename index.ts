import { useSofa } from "@graphql-yoga/plugin-sofa";
import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

const main = async () => {
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: `
        type Query {
          accounts: String!
        }
      `,
      resolvers: {
        Query: {
          accounts: (_, __, { request }: any) => {
            const testValue = request.headers.get("Authorization");
            return `This is the test value: ${testValue}`;
          }
        }
      }
    }),
    plugins: [
      useSofa({
        basePath: "/api",
        swaggerUI: {
          endpoint: "/docs",
        },
        routes: {
          'Query.accounts': { path: "/accounts" },
        }
      })
    ]
  });
  const server = createServer(yoga.requestListener);
  server.listen(3000, () => {
    console.log("Yoga listening on port 3000");
  })
}

void main();