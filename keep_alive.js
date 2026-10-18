const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('NATALINO TA ONLINE 24/7 - NATAL APOSTAS');
});

app.listen(10000, () => {
  console.log('Servidor Keep Alive LIGADO - NATALINO nunca vai dormir');
});
