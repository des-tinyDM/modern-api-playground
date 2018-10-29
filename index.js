const hapi = require("hapi");
const mongoose = require("mongoose");

//
const Painting = require("./models/Painting");

const server = hapi.server({
  port: 4000,
  host: "localhost"
});

const init = async () => {
  server.route([
    {
      method: "GET",
      path: "/",
      handler(request, reply) {
        `<h1>My modern api!</h1>`;
      }
    },
    {
      method: "GET",
      path: "/api/v1/paintings",
      handler(req, reply) {
        return Painting.find();
      }
    },
    {
      method: "POST",
      path: "/api/v1/paintings",
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