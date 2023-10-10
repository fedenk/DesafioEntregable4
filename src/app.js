import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productRouter from './routes/products.router.js';
import { Server } from 'socket.io';

const app = express();
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/realtimeproducts', productRouter);

const server = app.listen(8080, () => console.log('Server running'));

const socketServer = new Server(server);

app.set('socketio', socketServer);

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');
})