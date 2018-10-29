const hapi = require("hapi");
const mongoose = require("mongoose");

//
const Painting = require("./models/Painting");
const { graphqlHapi, graphiqlHapi } = require("apollo-server-hapi");
const schema = require("./graphql/schema");
/* swagger section */
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");

const server = hapi.server({
  port: 4000,
  host: "localhost"
});

const init = async () => {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Paintings API Documentation",
          version: Pack.version
        }
      }
    }
  ]);

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: "/graphiql",
      graphiqlOptions: {
        endpointURL: "/graphql"
      },
      route: {
        cors: true
      }
    }
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: "/graphql",
      graphqlOptions: {
        schema
      },
      route: {
        cors: true
      }
    }
  });

  server.route([
    {
      method: "GET",
      path: "/",
      config: {
        description: "Get all paintings",
        tags: ["api", "v1", "paintings"]
      },
      handler(request, reply) {
        `<h1>My modern api!</h1>`;
      }
    },
    {
      method: "GET",
      path: "/api/v1/paintings",
      config: {
        description: "Get a specific painting by id",
        tags: ["api", "v1", "paintings"]
      },
      handler(req, reply) {
        return Painting.find();
      }
    },
    {
      method: "POST",
      path: "/api/v1/paintings",
      config: {
        description: "Add a painting",
        tags: ["api", "v1", "paintings"]
      },
      handler: (req, reply) => {
        const { name, url, techniques } = req.payload;
        const painting = new Painting({
          name,
          url,
          techniques
        });

        return painting.save();
      }
    }
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}.`);
};

init();

mongoose.connect(
  "mongodb://admin:adpass1@ds243963.mlab.com:43963/api-design",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("connected to database");
});
