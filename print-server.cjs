// print-server.js
// Serveur d'impression local pour impression directe sur une imprimante thermique (ex: EPSON TM-T20III)

// print-server.cjs
const express = require('express');
const printer = require('printer');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3001;

app.use(bodyParser.json({ limit: '1mb' }));

// Endpoint pour imprimer un ticket
app.post('/print', function(req, res) {
  var content = req.body.content;
  var printerName = req.body.printerName;
  if (!content || !printerName) {
    return res.status(400).json({ success: false, error: 'content et printerName sont requis' });
  }

  printer.printDirect({
    data: content,
    printer: printerName, // ex: 'EPSON TM-T20III'
    type: 'RAW', // Pour ESC/POS ou texte brut
    success: function(jobID) { res.json({ success: true, jobID: jobID }); },
    error: function(err) { res.status(500).json({ success: false, error: err.message }); }
  });
});

// Endpoint pour lister les imprimantes disponibles
app.get('/printers', function(req, res) {
  try {
    var printers = printer.getPrinters();
    res.json({ success: true, printers: printers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, function() {
  console.log("Serveur d'impression lancé sur http://localhost:" + PORT);
});
