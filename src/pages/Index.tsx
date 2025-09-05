import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProductForm, Product } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import { TotalCalculator } from "@/components/TotalCalculator";
import { MaterialCostCalculator } from "@/components/MaterialCostCalculatorIndependent";
import { BudgetGenerator } from "@/components/BudgetGenerator";
import { BudgetHistory } from "@/components/BudgetHistoryUpdated";
import { CurrencySelector } from "@/components/CurrencySelector";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("productos");

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setActiveSection("presupuesto");
  };

  const handleBudgetSaved = () => {
    setEditingBudget(null);
    setActiveSection("historial");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "productos":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductForm onAddProduct={addProduct} />
            <ProductList products={products} onRemoveProduct={removeProduct} />
          </div>
        );
      case "totales":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <TotalCalculator products={products} />
            <CurrencySelector />
          </div>
        );
      case "costos":
        return <MaterialCostCalculator products={products} />;
      case "presupuesto":
        return (
          <BudgetGenerator 
            products={products} 
            editingBudget={editingBudget}
            onBudgetSaved={handleBudgetSaved}
          />
        );
      case "historial":
        return <BudgetHistory onEditBudget={handleEditBudget} />;
      default:
        return null;
    }
  };

  return (
    <CurrencyProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <div className="flex-1 flex flex-col">
            {/* Header con trigger del menú */}
            <header className="h-14 sm:h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center h-full px-3 sm:px-4 gap-4">
                <SidebarTrigger className="h-8 w-8 p-1 hover:bg-muted rounded-md transition-colors" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                    Calculadora Malla Viford Pro
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Administra productos, calcula costos y genera presupuestos profesionales
                  </p>
                </div>
              </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-1 p-3 sm:p-6 bg-gradient-to-br from-background to-muted/20">
              <div className="space-y-6">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </CurrencyProvider>
  );
};

export default Index;