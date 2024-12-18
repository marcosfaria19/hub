const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;
const uri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;

const client = new MongoClient(uri, {
  tls: true,
  tlsInsecure: true,
});

async function startServer() {
  try {
    await client.connect();

    const hub = client.db("hub");

    app.use(cors());
    app.use(express.json());

    // Importar rotas aqui para garantir que a coleção correta foi definida
    const qualinetRoutes = require("./src/routes/qualinetRoutes")(
      hub.collection("ocqualinet")
    );
    const netsmsfacilRoutes = require("./src/routes/netsmsfacilRoutes")(
      hub.collection("netsmsfacil")
    );
    const netfacilsgdRoutes = require("./src/routes/netfacilsgdRoutes")(
      hub.collection("netfacilsgd")
    );
    const usersRoutes = require("./src/routes/usersRoutes")(
      hub.collection("users"),
      hub.collection("ideas")
    );
    const subjectRoutes = require("./src/routes/subjectRoutes")(
      hub.collection("subjects")
    );
    const ideaRoutes = require("./src/routes/ideaRoutes")(
      hub.collection("ideas"),
      hub.collection("users")
    );
    const rankingRoutes = require("./src/routes/rankingRoutes")(
      hub.collection("rankings"),
      hub.collection("ideas"),
      hub.collection("users")
    );
    const appRoutes = require("./src/routes/appRoutes")(hub.collection("apps"));
    const notificationRoutes = require("./src/routes/notificationRoutes")(
      hub.collection("notifications"),
      hub.collection("rankings"),
      hub.collection("ideas"),
      hub.collection("users")
    );

    // Rotas protegidas
    app.use("/", qualinetRoutes);
    app.use("/", usersRoutes);
    app.use("/", netsmsfacilRoutes);
    app.use("/", netfacilsgdRoutes);
    app.use("/", appRoutes);
    app.use("/spark/", subjectRoutes);
    app.use("/spark/", ideaRoutes);
    app.use("/spark/", rankingRoutes);
    app.use("/notifications/", notificationRoutes);

    // Middleware para servir imagens estáticas
    app.use(
      "/assets/cards",
      express.static(path.join(__dirname, "src/assets/cards"), {
        setHeaders: (res, path) => {},
      })
    );

    app.use(
      "/assets/logos",
      express.static(path.join(__dirname, "src/assets/logos"), {
        setHeaders: (res, path) => {},
      })
    );

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

startServer();
