import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { History, Search, Trash2, Share2, Eye, Calendar, User, Building, Edit } from "lucide-react";
import { Budget } from "./BudgetGenerator";
import { useToast } from "@/hooks/use-toast";

interface BudgetHistoryProps {
  onEditBudget?: (budget: Budget) => void;
}

export const BudgetHistory = ({ onEditBudget }: BudgetHistoryProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    const savedBudgets = JSON.parse(localStorage.getItem('viford-budgets') || '[]');
    setBudgets(savedBudgets);
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'Bs.' = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } else {
      return `Bs. ${new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)}`;
    }
  };

  const filteredBudgets = budgets.filter(budget =>
    budget.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.clientRIF.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (budget.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (budget.companyRIF || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.date.includes(searchTerm)
  );

  const deleteBudget = (budgetId: string) => {
    const updatedBudgets = budgets.filter(b => b.id !== budgetId);
    setBudgets(updatedBudgets);
    localStorage.setItem('viford-budgets', JSON.stringify(updatedBudgets));
    
    if (selectedBudget?.id === budgetId) {
      setSelectedBudget(null);
    }
    
    toast({
      title: "Presupuesto eliminado",
      description: "El presupuesto ha sido eliminado exitosamente",
      variant: "default"
    });
  };

  const shareBudget = async (budget: Budget) => {
    const shareText = `${budget.companyName || 'EMPRESA VIFORD PRO C.A.'}\n` +
      `${budget.companyRIF ? `RIF: ${budget.companyRIF}\n` : ''}` +
      `PRESUPUESTO N°: ${budget.budgetNumber}\n\n` +
      `Cliente: ${budget.clientName}\n` +
      `${budget.clientAddress ? `Dirección: ${budget.clientAddress}\n` : ''}` +
      `${budget.clientRIF ? `RIF Cliente: ${budget.clientRIF}\n` : ''}` +
      `Fecha: ${budget.date}\n\n` +
      `MATERIALES:\n` +
      `${budget.products.map((p, index) => 
        `${index + 1}. ${p.name.toUpperCase()}\n` +
        `   Medida: ${p.width} x ${p.height}m\n` +
        `   Precio: ${formatCurrency(p.price, budget.currency)} ${p.unit === 'pieza' ? 'por pieza' : 'por metro lineal'}\n` +
        `   Cantidad: ${p.unit === 'pieza' ? p.quantity : (p.width * p.height).toFixed(2)} ${p.unit === 'pieza' ? 'piezas' : 'ml'}\n` +
        `   Subtotal: ${formatCurrency(p.total, budget.currency)}\n`
      ).join('\n')}\n` +
      `SUBTOTAL: ${formatCurrency(budget.subtotal, budget.currency)}\n` +
      `${budget.includeIVA ? `IVA (16%): ${formatCurrency(budget.iva, budget.currency)}\n` : ''}` +
      `TOTAL GENERAL: ${formatCurrency(budget.total, budget.currency)}\n` +
      `${budget.notes ? `\nNOTAS: ${budget.notes}` : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Presupuesto - ${budget.clientName}`,
          text: shareText
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copiado",
        description: "Presupuesto copiado al portapapeles",
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Presupuestos ({budgets.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Buscador */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, RIF o fecha..."
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de Presupuestos */}
            <div className="space-y-4">
              {filteredBudgets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {budgets.length === 0 ? (
                    <div>
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay presupuestos guardados</p>
                      <p className="text-sm">Genera tu primer presupuesto en la pestaña anterior</p>
                    </div>
                  ) : (
                    <p>No se encontraron presupuestos con "{searchTerm}"</p>
                  )}
                </div>
              ) : (
                filteredBudgets.map((budget) => (
                  <Card 
                    key={budget.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBudget?.id === budget.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBudget(budget)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">{budget.clientName}</h3>
                          </div>
                          
                          {budget.clientAddress && (
                            <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                              <Building className="h-3 w-3" />
                              <span>{budget.clientAddress}</span>
                            </div>
                          )}
                          
                          {budget.clientRIF && (
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <Building className="h-3 w-3" />
                              <span>{budget.clientRIF}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{budget.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {budget.products.length} productos
                            </Badge>
                            <Badge className={budget.includeIVA ? 'bg-success' : 'bg-warning'}>
                              {budget.includeIVA ? 'Con IVA' : 'Sin IVA'}
                            </Badge>
                            <Badge variant="secondary">
                              {budget.currency}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg text-primary">
                            {formatCurrency(budget.total, budget.currency)}
                          </div>
                          <div className="flex gap-1 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBudget(budget);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEditBudget) {
                                  onEditBudget(budget);
                                }
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                shareBudget(budget);
                              }}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBudget(budget.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Vista Completa del Presupuesto Seleccionado */}
            <div>
              {selectedBudget ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Vista del Presupuesto</span>
                      <Button
                        size="sm"
                        onClick={() => shareBudget(selectedBudget)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Vista Previa del Presupuesto - Igual que en BudgetGenerator */}
                    <div className="p-4 bg-muted rounded-lg border-2 border-dashed">
                      <div className="text-center border-b pb-3 mb-4">
                        <h2 className="font-bold text-lg text-primary">
                          {selectedBudget.companyName || "EMPRESA VIFORD PRO C.A."}
                        </h2>
                        {selectedBudget.companyRIF && (
                          <p className="text-sm text-muted-foreground">RIF: {selectedBudget.companyRIF}</p>
                        )}
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className="font-medium">PRESUPUESTO</span>
                          <span className="font-medium">N°: {selectedBudget.budgetNumber}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium">Cliente:</span>
                          <p>{selectedBudget.clientName}</p>
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span>
                          <p>{selectedBudget.date}</p>
                        </div>
                        {selectedBudget.clientAddress && (
                          <div className="col-span-2">
                            <span className="font-medium">Dirección:</span>
                            <p>{selectedBudget.clientAddress}</p>
                          </div>
                        )}
                        {selectedBudget.clientRIF && (
                          <div className="col-span-2">
                            <span className="font-medium">RIF Cliente:</span>
                            <p>{selectedBudget.clientRIF}</p>
                          </div>
                        )}
                      </div>

                      <div className="border rounded p-3 mb-4 bg-background">
                        <h4 className="font-semibold mb-2">MATERIALES</h4>
                        <div className="space-y-2">
                          {selectedBudget.products.map((product, index) => (
                            <div key={index} className="text-xs border-b pb-2">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">{index + 1}. {product.name.toUpperCase()}</p>
                                  <p>Medida: {product.width} x {product.height}m</p>
                                  <p>Precio: {formatCurrency(product.price, selectedBudget.currency)} {product.unit === 'pieza' ? 'por pieza' : 'por metro lineal'}</p>
                                </div>
                                <div className="text-right">
                                  <p>Cant: {product.unit === 'pieza' ? product.quantity : (product.width * product.height).toFixed(2)} {product.unit === 'pieza' ? 'pzs' : 'ml'}</p>
                                  <p className="font-bold">{formatCurrency(product.total, selectedBudget.currency)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Subtotal:</span>
                          <span className="font-medium">{formatCurrency(selectedBudget.subtotal, selectedBudget.currency)}</span>
                        </div>
                        
                        {selectedBudget.includeIVA && (
                          <div className="flex justify-between text-sm mb-1">
                            <span>IVA (16%):</span>
                            <span className="font-medium text-warning">{formatCurrency(selectedBudget.iva, selectedBudget.currency)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>TOTAL GENERAL:</span>
                          <span className="text-primary">{formatCurrency(selectedBudget.total, selectedBudget.currency)}</span>
                        </div>
                      </div>

                      {selectedBudget.notes && (
                        <div className="border-t pt-3 mt-3">
                          <span className="font-medium text-sm">Notas:</span>
                          <p className="text-xs text-muted-foreground mt-1">{selectedBudget.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un presupuesto para ver los detalles</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};