import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Placeholder for a global header */}
      <header className="bg-white shadow-sm p-4">
        <nav>
          <p className="font-bold text-xl">StockBox</p>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      {/* Placeholder for a global footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} StockBox. All rights reserved.
      </footer>
    </div>
  );
};
