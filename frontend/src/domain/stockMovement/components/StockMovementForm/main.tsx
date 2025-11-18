import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Textarea } from '@/core/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { useCreateStockMovement } from '../../hooks/useCreateStockMovement';
import type { Product } from '@/domain/product/types';

const movementFormSchema = z
  .object({
    movement_type: z.enum(['ENTRADA', 'SAIDA', 'AJUSTE']),
    quantity: z.coerce.number().int().positive('A quantidade deve ser maior que zero.'),
    reason: z.string().optional(),
  })
  .refine(
    (data) => {
      if ((data.movement_type === 'SAIDA' || data.movement_type === 'AJUSTE') && !data.reason) {
        return false;
      }
      return true;
    },
    {
      message: 'O motivo é obrigatório para saídas e ajustes.',
      path: ['reason'],
    }
  );

type MovementFormValues = z.infer<typeof movementFormSchema>;

interface StockMovementFormProps {
  product: Product;
  onSuccess?: () => void;
}

export const StockMovementForm = ({ product, onSuccess }: StockMovementFormProps) => {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      movement_type: 'ENTRADA',
      quantity: 1,
      reason: '',
    },
  });

  const createMovementMutation = useCreateStockMovement();

  const onSubmit = (data: MovementFormValues) => {
    createMovementMutation.mutate(
      { ...data, product_id: product.product_id },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="movement_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Movimentação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                  <SelectItem value="AJUSTE">Ajuste</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Motivo da movimentação (obrigatório para saídas/ajustes)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createMovementMutation.isPending}>
          {createMovementMutation.isPending ? 'Registrando...' : 'Registrar Movimentação'}
        </Button>
      </form>
    </Form>
  );
};
