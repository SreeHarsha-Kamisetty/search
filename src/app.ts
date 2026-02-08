import express from 'express';
import searchRoutes from './routes/search.routes';
import productsRoutes from './routes/products.routes';

const app = express();

app.use(express.json());

app.use('/search', searchRoutes);
app.use('/products', productsRoutes);

export default app;
