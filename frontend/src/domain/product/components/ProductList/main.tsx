import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/ui/dialog';
import { ProductForm } from '../ProductForm';
import { StockMovementForm } from '@/domain/stockMovement/components/StockMovementForm';
import type { Product } from '../../types';

export const ProductList = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isMovementModalOpen, setMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading, error } = useProducts();

  const handleMovementClick = (product: Product) => {
    setSelectedProduct(product);
    setMovementModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Ocorreu um erro ao carregar os produtos.</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos em Estoque</CardTitle>
        <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Produto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Estoque Atual</TableHead>
              <TableHead>Estoque Mínimo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.current_stock_quantity}</TableCell>
                <TableCell>{product.minimum_stock_level}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleMovementClick(product)}>
                    Movimentar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data?.data.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Nenhum produto encontrado.</p>
        )}
      </CardContent>

      <Dialog open={isMovementModalOpen} onOpenChange={setMovementModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimentação</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedProduct?.name} ({selectedProduct?.sku})
            </p>
          </DialogHeader>
          {selectedProduct && (
            <StockMovementForm
              product={selectedProduct}
              onSuccess={() => setMovementModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
