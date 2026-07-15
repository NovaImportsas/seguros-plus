/**
 * SEGUROS + → Google Sheets
 * ==========================
 * Cómo instalarlo (2 minutos):
 * 1. Crea un Google Sheet nuevo (ej. "Leads Seguros +").
 * 2. Menú: Extensiones → Apps Script.
 * 3. Borra lo que haya y pega TODO este código. Guarda.
 * 4. Botón "Implementar" → "Nueva implementación" → tipo "Aplicación web".
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 5. Copia la URL que termina en /exec y pásamela (o pégala en index.html
 *    en la constante SHEETS_URL).
 *
 * Cada tipo de seguro se guarda en su propia hoja (Vida, Autos, Todo Riesgo).
 */

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var tipo = data.tipo || 'General';
  var sheet = ss.getSheetByName(tipo);

  // Columnas por tipo de seguro
  var columnas = {
    'Seguro de Vida':        ['fecha', 'nombre', 'telefono', 'email', 'edad', 'ciudad', 'interes'],
    'Seguro de Autos':       ['fecha', 'nombre', 'telefono', 'placa', 'marca', 'modelo', 'ciudad'],
    'Seguro Todo Riesgo':    ['fecha', 'nombre', 'telefono', 'email', 'bien', 'ciudad'],
    'Seguros de Personas':   ['fecha', 'nombre', 'telefono', 'email', 'ciudad', 'ramo'],
    'Seguros de Daños':      ['fecha', 'nombre', 'telefono', 'email', 'ciudad', 'ramo', 'perfil']
  };
  var cols = columnas[tipo] || Object.keys(data);

  // Crea la hoja con encabezados si no existe
  if (!sheet) {
    sheet = ss.insertSheet(tipo);
    sheet.appendRow(cols.map(function(c){ return c.toUpperCase(); }));
    sheet.getRange(1, 1, 1, cols.length).setFontWeight('bold');
  }

  // Agrega la fila
  sheet.appendRow(cols.map(function(c){ return data[c] || ''; }));

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
