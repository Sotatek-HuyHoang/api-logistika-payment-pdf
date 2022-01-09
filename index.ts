import express from 'express';
import path from 'path';
import route from './route/pdf.route';
import { engine } from 'express-handlebars'

const app = express();
const PORT = 3000;

app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'templates'));
app.use('/api/receipt-payment', route);
app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});




