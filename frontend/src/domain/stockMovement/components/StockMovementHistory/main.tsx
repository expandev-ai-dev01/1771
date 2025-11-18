import { useState } from 'react';
import { useStockMovements } from '../../hooks/useStockMovements';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table';
import { format } from 'date-fns';

export const StockMovementHistory = () => {
  const [filters, setFilters] = useState({}); // Placeholder for filter state
  const { data, isLoading, error } = useStockMovements(filters);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Ocorreu um erro ao carregar o histórico.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Movimentações</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Add filter controls here */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto (SKU)</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((movement) => (
              <TableRow key={movement.movement_id}>
                <TableCell>
                  {format(new Date(movement.movement_date), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {movement.product?.name} ({movement.product?.sku})
                </TableCell>
                <TableCell>{movement.movement_type}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.reason || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data?.data.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Nenhuma movimentação encontrada.</p>
        )}
      </CardContent>
    </Card>
  );
};
