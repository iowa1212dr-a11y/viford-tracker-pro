import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import { Product } from "./ProductForm";

interface TotalCalculatorProps {
  products: Product[];
}

export const TotalCalculator = ({ products }: TotalCalculatorProps) => {
  const [includeIVA, setIncludeIVA] = useState(true);
  
  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const iva = includeIVA ? subtotal * 0.16 : 0; // 16% IVA opcional
  const total = subtotal + iva;
  
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-success to-success/90 text-success-foreground">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Resumen de Totales
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalProducts}</div>
              <div className="text-sm text-muted-foreground">Productos</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalQuantity}</div>
              <div className="text-sm text-muted-foreground">Cantidad Total</div>
            </div>
          </div>

          {/* IVA Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
            <div className="space-y-1">
              <Label htmlFor="iva-switch" className="text-sm font-medium">
                Incluir IVA (16%)
              </Label>
              <p className="text-xs text-muted-foreground">
                Activar/desactivar el cálculo del IVA
              </p>
            </div>
            <Switch
              id="iva-switch"
              checked={includeIVA}
              onCheckedChange={setIncludeIVA}
            />
          </div>

          {/* Calculations */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium">Subtotal:</span>
              <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            
            {includeIVA && (
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">IVA (16%):</span>
                <span className="text-lg font-semibold text-warning">{formatCurrency(iva)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 border-2 border-primary rounded-lg px-4 bg-primary/5">
              <span className="text-xl font-bold text-primary">
                TOTAL {includeIVA ? '(con IVA)' : '(sin IVA)'}:
              </span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {products.length > 0 && (
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 text-accent font-medium mb-2">
                <TrendingUp className="h-4 w-4" />
                Desglose por Producto
              </div>
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {product.name} ({product.quantity}x)
                    </span>
                    <span className="font-medium">{formatCurrency(product.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};