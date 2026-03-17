const express = require('express');
const app = express();

app.use(express.json());

app.use('/platos', require('./routes/platos'));
app.use('/ingredientes', require('./routes/ingredientes'));
app.use('/mesas', require('./routes/mesas'));
app.use('/ordenes', require('./routes/ordenes'));

const server = app.listen(3000, () =>
  console.log(`API Restaurante corriendo en http://localhost:${server.address().port}`)
);