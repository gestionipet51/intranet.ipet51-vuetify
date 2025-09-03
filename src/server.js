const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const firebird = require("node-firebird");
//  import { dbConfig } from '../../../firebaseConfig';

// Configurar la conexión a Firebird

    const firebirdConfig = {
    host: "localhost",
    port: 3050,
    database:  "https://intranetipet51-20049-default-rtdb.firebaseio.com",
    user: "gestion.ipet51@gmail.com",
    password: "e8eA&2707LAP",
    lowercase_keys: false,
    role: null,
    pageSize: 4096
    };


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ruta para recibir datos CSV
app.post("/subir-csv", (req, res) => {
  const datos = req.body; // Datos enviados desde Vue.js

  firebird.attach(firebirdConfig, (err, db) => {
    if (err) {
      console.error("Error al conectar con Firebird:", err);
      return res.status(500).json({ error: "Error de conexión a la base de datos." });
    }

    // Insertar los datos en Firebird
    const promesas = datos.map((fila) => {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO mi_tabla (columna1, columna2, columna3)
          VALUES (?, ?, ?)
        `;
        db.query(query, [fila.columna1, fila.columna2, fila.columna3], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    });

    // Manejar todas las promesas
    Promise.all(promesas)
      .then(() => {
        db.detach();
        res.json({ message: "Datos insertados correctamente." });
      })
      .catch((error) => {
        db.detach();
        console.error("Error al insertar datos:", error);
        res.status(500).json({ error: "Error al insertar datos en la base de datos." });
      });
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});