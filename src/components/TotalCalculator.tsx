import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import { Product } from "./ProductForm";
import { useCurrency } from "./CurrencyProvider";

interface TotalCalculatorProps {
  products: Product[];
}

export const TotalCalculator = ({ products }: TotalCalculatorProps) => {
  const [includeIVA, setIncludeIVA] = useState(true);
  const { formatAmount, convertAmount, currency } = useCurrency();
  
  const subtotal = products.reduce((sum, product) => sum + convertAmount(product.total), 0);
  const iva = includeIVA ? subtotal * 0.16 : 0;
  const total = subtotal + iva;
  
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

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
          <div className="flex items-center justify-between">
            <Label htmlFor="iva-switch" className="text-sm">Incluir IVA (16%)</Label>
            <Button
              variant={includeIVA ? "default" : "outline"}
              size="sm"
              onClick={() => setIncludeIVA(!includeIVA)}
            >
              {includeIVA ? "Con IVA" : "Sin IVA"}
            </Button>
          </div>

          {/* Calculations */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">{formatAmount(subtotal)}</span>
            </div>
            
            {includeIVA && (
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span className="font-medium text-warning">{formatAmount(iva)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total ({currency}):</span>
              <span className="text-success">{formatAmount(total)}</span>
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
                    <span className="font-medium">{formatAmount(convertAmount(product.total))}</span>
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