import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/core/lib/utils';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    'px-3 py-2 rounded-md text-sm font-medium',
    isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
  );

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="font-bold text-xl">
            StockBox
          </NavLink>
          <div className="flex items-center space-x-4">
            <NavLink to="/products" className={navLinkClasses}>
              Produtos
            </NavLink>
            <NavLink to="/stock-movements" className={navLinkClasses}>
              Histórico
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="bg-white p-4 text-center text-sm text-gray-600 border-t">
        © {new Date().getFullYear()} StockBox. All rights reserved.
      </footer>
    </div>
  );
};
