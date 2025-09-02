import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "./CurrencyProvider";

export interface Product {
  id: string;
  name: string;
  width: number;
  height: number;
  price: number;
  unit: 'metro' | 'pieza';
  quantity: number;
  total: number;
}

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

export const ProductForm = ({ onAddProduct }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "Malla Viford Pro",
    width: "",
    height: "",
    price: "",
    unit: "metro" as 'metro' | 'pieza',
    quantity: "1"
  });

  const { toast } = useToast();
  const { formatAmount, currency } = useCurrency();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.width || !formData.height || !formData.price || !formData.quantity) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const width = parseFloat(formData.width);
    const height = parseFloat(formData.height);
    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity);
    
    let total: number;
    if (formData.unit === 'metro') {
      const area = width * height;
      total = area * price * quantity;
    } else {
      total = price * quantity;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: formData.name,
      width,
      height,
      price,
      unit: formData.unit,
      quantity,
      total
    };

    onAddProduct(product);
    
    // Reset form except name and unit
    setFormData({
      ...formData,
      width: "",
      height: "",
      price: "",
      quantity: "1"
    });
    
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado correctamente`,
      variant: "default"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Malla Viford Pro
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Ancho (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                className="mt-1"
                placeholder="2.00"
              />
            </div>
            <div>
              <Label htmlFor="height">Alto (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="mt-1"
                placeholder="1.50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1"
                placeholder="150.00"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unidad</Label>
              <Select value={formData.unit} onValueChange={(value: 'metro' | 'pieza') => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metro">Por Metro²</SelectItem>
                  <SelectItem value="pieza">Por Pieza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};