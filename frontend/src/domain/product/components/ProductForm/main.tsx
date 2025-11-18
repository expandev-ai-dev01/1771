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
import { useCreateProduct } from '../../hooks/useCreateProduct';

const productFormSchema = z.object({
  sku: z
    .string()
    .min(3, 'SKU deve ter no mínimo 3 caracteres.')
    .max(50, 'SKU deve ter no máximo 50 caracteres.'),
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres.')
    .max(150, 'Nome deve ter no máximo 150 caracteres.'),
  description: z.string().optional(),
  minimum_stock_level: z.coerce
    .number()
    .int()
    .min(0, 'Nível de estoque mínimo não pode ser negativo.'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

export const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      minimum_stock_level: 0,
    },
  });

  const createProductMutation = useCreateProduct();

  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="SKU-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição detalhada do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimum_stock_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível Mínimo de Estoque</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createProductMutation.isPending}>
          {createProductMutation.isPending ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </form>
    </Form>
  );
};
