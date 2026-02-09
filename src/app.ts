import express from 'express';
import path from 'path';
import searchRoutes from './routes/search.routes';
import productsRoutes from './routes/products.routes';

const app = express();

app.use(express.json());

app.use('/search', searchRoutes);
app.use('/products', productsRoutes);

const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

export default app;
