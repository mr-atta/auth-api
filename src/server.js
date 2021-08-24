"use strict";

const express = require("express");

const notFoundHandler = require("./error-handlers/404.js");
const errorHandler = require("./error-handlers/500.js");
const logger = require("./middleware/logger.js");

const v1Routes = require("./routes/v1.js");
//
const authRoutes = require("./routes/routes");
const v2Routes = require("./routes/v2");

//

// app
const app = express();

// app.use
app.use(express.json());

//
// app.use(cors());
// app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
//

app.use(logger);

app.use("/api/v1", v1Routes); /////////////////
app.use("/api/v2", v2Routes); /////////////////

app.use("*", notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error("Missing Port");
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

/* 

'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};

*/
