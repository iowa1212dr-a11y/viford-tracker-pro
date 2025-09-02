import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm, Product } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import { TotalCalculator } from "@/components/TotalCalculator";
import { MaterialCostCalculator } from "@/components/MaterialCostCalculator";
import { BudgetGenerator } from "@/components/BudgetGenerator";
import { BudgetHistory } from "@/components/BudgetHistory";
import { CurrencySelector } from "@/components/CurrencySelector";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Calculadora Malla Viford Pro
            </h1>
            <p className="text-muted-foreground">
              Administra productos, calcula costos y genera presupuestos profesionales
            </p>
          </div>

          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="productos">Productos</TabsTrigger>
              <TabsTrigger value="totales">Totales</TabsTrigger>
              <TabsTrigger value="costos">Costos</TabsTrigger>
              <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="productos" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ProductForm onAddProduct={addProduct} />
                <ProductList products={products} onRemoveProduct={removeProduct} />
              </div>
            </TabsContent>

            <TabsContent value="totales" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <TotalCalculator products={products} />
                <CurrencySelector />
              </div>
            </TabsContent>

            <TabsContent value="costos" className="space-y-6">
              <MaterialCostCalculator products={products} />
            </TabsContent>

            <TabsContent value="presupuesto" className="space-y-6">
              <BudgetGenerator products={products} />
            </TabsContent>

            <TabsContent value="historial" className="space-y-6">
              <BudgetHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CurrencyProvider>
  );
};

export default Index;