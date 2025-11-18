import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao StockBox</h1>
      <p className="text-lg text-gray-600 mb-8">
        Gerencie seu estoque de forma simples e eficiente.
      </p>
      <div className="space-x-4">
        <Link
          to="/products"
          className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-lg font-semibold"
        >
          Ver Produtos
        </Link>
        <Link
          to="/stock-movements"
          className="inline-block bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md text-lg font-semibold"
        >
          Ver Histórico
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
