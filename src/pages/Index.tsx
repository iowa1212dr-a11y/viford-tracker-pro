import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm, Product } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import { TotalCalculator } from "@/components/TotalCalculator";
import { CostCalculator } from "@/components/CostCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calculator, DollarSign, Grid3X3 } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const clearAllProducts = () => {
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Grid3X3 className="h-8 w-8" />
              Calculadora Malla Viford Pro
            </CardTitle>
            <p className="text-primary-foreground/90 mt-2">
              Gestiona tus productos, calcula totales y obtén costos con IVA
            </p>
          </CardHeader>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="products" className="flex items-center gap-2 p-3">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Productos</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2 p-3">
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="totals" className="flex items-center gap-2 p-3">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Totales</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2 p-3">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Costos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <ProductForm onAddProduct={addProduct} />
            
            {products.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Resumen Rápido</h3>
                    <button 
                      onClick={clearAllProducts}
                      className="text-sm text-destructive hover:underline"
                    >
                      Limpiar todo
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{products.length}</div>
                      <div className="text-sm text-muted-foreground">Productos</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-accent">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        }).format(products.reduce((sum, p) => sum + p.total, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <ProductList products={products} onRemoveProduct={removeProduct} />
          </TabsContent>

          <TabsContent value="totals" className="space-y-6">
            <TotalCalculator products={products} />
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <CostCalculator products={products} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            <p>Calculadora Malla Viford Pro - Versión Móvil</p>
            <p className="mt-1">Desarrollado para gestión eficiente de inventarios</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;