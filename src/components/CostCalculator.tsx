import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Percent, Save } from "lucide-react";
import { Product } from "./ProductForm";
import { useToast } from "@/hooks/use-toast";

interface CostCalculatorProps {
  products: Product[];
}

export const CostCalculator = ({ products }: CostCalculatorProps) => {
  const [costPercentage, setCostPercentage] = useState<string>("70");
  const [additionalCosts, setAdditionalCosts] = useState<string>("0");
  const [savedCosts, setSavedCosts] = useState<any>(null);
  
  const { toast } = useToast();

  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const costPercent = parseFloat(costPercentage) / 100;
  const additional = parseFloat(additionalCosts) || 0;
  
  const materialCost = subtotal * costPercent;
  const totalCost = materialCost + additional;
  const profit = subtotal - totalCost;
  const profitMargin = subtotal > 0 ? ((profit / subtotal) * 100) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const saveCosts = () => {
    const costData = {
      date: new Date().toLocaleDateString('es-MX'),
      subtotal,
      materialCost,
      additionalCosts: additional,
      totalCost,
      profit,
      profitMargin,
      products: products.length
    };
    
    setSavedCosts(costData);
    
    toast({
      title: "Costos guardados",
      description: "Los costos han sido calculados y guardados",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-warning to-warning/90 text-warning-foreground">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Calculadora de Costos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="costPercentage">Porcentaje de Costo del Material (%)</Label>
                <div className="relative mt-1">
                  <Input
                    id="costPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={costPercentage}
                    onChange={(e) => setCostPercentage(e.target.value)}
                    className="pr-8"
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Porcentaje del precio de venta que representa el costo del material
                </p>
              </div>

              <div>
                <Label htmlFor="additionalCosts">Costos Adicionales</Label>
                <Input
                  id="additionalCosts"
                  type="number"
                  step="0.01"
                  value={additionalCosts}
                  onChange={(e) => setAdditionalCosts(e.target.value)}
                  className="mt-1"
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Transporte, instalación, otros gastos
                </p>
              </div>

              <Button onClick={saveCosts} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Calcular y Guardar Costos
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">Desglose de Costos</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Precio de Venta (Subtotal):</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Costo del Material ({costPercentage}%):</span>
                    <span className="font-medium text-warning">{formatCurrency(materialCost)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Costos Adicionales:</span>
                    <span className="font-medium text-warning">{formatCurrency(additional)}</span>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Costo Total:</span>
                      <span className="text-destructive">{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Ganancia:</span>
                      <span className={profit >= 0 ? 'text-success' : 'text-destructive'}>
                        {formatCurrency(profit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Margen de Ganancia:</span>
                      <span className={profitMargin >= 0 ? 'text-success' : 'text-destructive'}>
                        {profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Costs Display */}
      {savedCosts && (
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Costos Guardados - {savedCosts.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Productos:</span> {savedCosts.products}
              </div>
              <div>
                <span className="font-medium">Precio de Venta:</span> {formatCurrency(savedCosts.subtotal)}
              </div>
              <div>
                <span className="font-medium">Costo Total:</span> {formatCurrency(savedCosts.totalCost)}
              </div>
              <div>
                <span className="font-medium">Ganancia:</span> 
                <span className={savedCosts.profit >= 0 ? 'text-success ml-1' : 'text-destructive ml-1'}>
                  {formatCurrency(savedCosts.profit)} ({savedCosts.profitMargin.toFixed(1)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};