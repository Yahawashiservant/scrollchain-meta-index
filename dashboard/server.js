const express = require('express');
const app = express();
app.use(express.static('.'));
app.listen(3690, () => console.log('🧭 Dashboard live on http://localhost:3690'));
