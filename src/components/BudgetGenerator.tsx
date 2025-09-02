import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Share2, User, Building, Calendar, Hash } from "lucide-react";
import { Product } from "./ProductForm";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "./CurrencyProvider";

interface BudgetGeneratorProps {
  products: Product[];
}

export interface Budget {
  id: string;
  budgetNumber: string;
  clientName: string;  
  clientRIF: string;
  companyName: string;
  companyRIF: string;
  notes: string;
  date: string;
  products: Product[];
  includeIVA: boolean;
  subtotal: number;
  iva: number;
  total: number;
  currency: 'USD' | 'VES';
}

export const BudgetGenerator = ({ products }: BudgetGeneratorProps) => {
  const [clientName, setClientName] = useState("");
  const [clientRIF, setClientRIF] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyRIF, setCompanyRIF] = useState("");
  const [notes, setNotes] = useState("");
  const [includeIVA, setIncludeIVA] = useState(true);
  const [budgetNumber, setBudgetNumber] = useState("");
  
  const { formatAmount, convertAmount, currency } = useCurrency();
  const { toast } = useToast();

  const subtotal = products.reduce((sum, product) => sum + convertAmount(product.total), 0);
  const iva = includeIVA ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  useEffect(() => {
    const getNextBudgetNumber = () => {
      const existingBudgets = JSON.parse(localStorage.getItem('viford-budgets') || '[]');
      const lastNumber = existingBudgets.length > 0 
        ? Math.max(...existingBudgets.map((b: Budget) => parseInt(b.budgetNumber) || 0))
        : 0;
      return String(lastNumber + 1).padStart(4, '0');
    };
    
    if (!budgetNumber) {
      setBudgetNumber(getNextBudgetNumber());
    }
  }, [budgetNumber]);

  const saveBudget = () => {
    if (!clientName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del cliente es requerido",
        variant: "destructive"
      });
      return;
    }

    if (products.length === 0) {
      toast({
        title: "Error", 
        description: "Debe agregar al menos un producto",
        variant: "destructive"
      });
      return;
    }

    const budget: Budget = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      budgetNumber: budgetNumber,
      clientName,
      clientRIF,
      companyName,
      companyRIF,
      notes,
      date: new Date().toLocaleDateString('es-MX'),
      products: [...products].map(p => ({
        ...p,
        price: convertAmount(p.price),
        total: convertAmount(p.total)
      })),
      includeIVA,
      subtotal,
      iva,
      total,
      currency
    };

    // Guardar en localStorage
    const existingBudgets = JSON.parse(localStorage.getItem('viford-budgets') || '[]');
    const updatedBudgets = [budget, ...existingBudgets];
    localStorage.setItem('viford-budgets', JSON.stringify(updatedBudgets));

    toast({
      title: "Presupuesto guardado",
      description: `Presupuesto para ${clientName} guardado exitosamente`,
      variant: "default"
    });

    // Limpiar formulario y generar siguiente número
    setClientName("");
    setClientRIF("");
    setNotes("");
    
    const nextNumber = String(parseInt(budgetNumber) + 1).padStart(4, '0');
    setBudgetNumber(nextNumber);
  };

  const shareBudget = async () => {
    if (!clientName.trim()) {
      toast({
        title: "Error",
        description: "Complete el nombre del cliente primero",
        variant: "destructive"
      });
      return;
    }

    const shareText = `${companyName || 'EMPRESA VIFORD PRO C.A.'}\n` +
      `${companyRIF ? `RIF: ${companyRIF}\n` : ''}` +
      `PRESUPUESTO N°: ${budgetNumber}\n\n` +
      `Cliente: ${clientName}\n` +
      `${clientRIF ? `RIF: ${clientRIF}\n` : ''}` +
      `Fecha: ${new Date().toLocaleDateString('es-MX')}\n\n` +
      `MATERIALES:\n` +
      `${products.map((p, index) => 
        `${index + 1}. ${p.name.toUpperCase()}\n` +
        `   Medida: ${p.width} x ${p.height}m\n` +
        `   Precio: ${formatAmount(convertAmount(p.price))} ${p.unit === 'pieza' ? 'por pieza' : 'por m²'}\n` +
        `   Cantidad: ${p.unit === 'pieza' ? p.quantity : (p.width * p.height).toFixed(2)} ${p.unit === 'pieza' ? 'piezas' : 'm²'}\n` +
        `   Subtotal: ${formatAmount(convertAmount(p.total))}\n`
      ).join('\n')}\n` +
      `SUBTOTAL: ${formatAmount(subtotal)}\n` +
      `${includeIVA ? `IVA (16%): ${formatAmount(iva)}\n` : ''}` +
      `TOTAL GENERAL: ${formatAmount(total)}\n` +
      `${notes ? `\nNOTAS: ${notes}` : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Presupuesto - ${clientName}`,
          text: shareText
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para copiar al clipboard
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
        <CardHeader className="bg-gradient-to-r from-success to-success/90 text-success-foreground">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generar Presupuesto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de la Empresa y Cliente */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-3">Datos de la Empresa</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Nombre de la Empresa
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="EMPRESA VIFORD PRO C.A."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyRIF" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      RIF de la Empresa
                    </Label>
                    <Input
                      id="companyRIF"
                      value={companyRIF}
                      onChange={(e) => setCompanyRIF(e.target.value)}
                      placeholder="J-12345678-9"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <h4 className="font-semibold text-secondary mb-3">Datos del Cliente</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="clientName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre del Cliente *
                    </Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nombre completo o empresa"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientRIF" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      RIF/CÉDULA (Opcional)
                    </Label>
                    <Input
                      id="clientRIF"
                      value={clientRIF}
                      onChange={(e) => setClientRIF(e.target.value)}
                      placeholder="J-12345678-9 o V-12345678"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="budgetNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Número del Presupuesto
                </Label>
                <Input
                  id="budgetNumber"
                  value={budgetNumber}
                  onChange={(e) => setBudgetNumber(e.target.value)}
                  placeholder="0001"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Se incrementa automáticamente al guardar
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Condiciones de pago, tiempo de entrega, etc."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* IVA Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="iva-switch-budget" className="text-sm font-medium">
                    Incluir IVA (16%)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Activar/desactivar el IVA en el presupuesto
                  </p>
                </div>
                <Switch
                  id="iva-switch-budget"
                  checked={includeIVA}
                  onCheckedChange={setIncludeIVA}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveBudget} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Presupuesto
                </Button>
                <Button onClick={shareBudget} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>

            {/* Vista Previa del Presupuesto */}
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg border-2 border-dashed">
                <div className="text-center border-b pb-3 mb-4">
                  <h2 className="font-bold text-lg text-primary">
                    {companyName || "EMPRESA VIFORD PRO C.A."}
                  </h2>
                  {companyRIF && (
                    <p className="text-sm text-muted-foreground">RIF: {companyRIF}</p>
                  )}
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="font-medium">PRESUPUESTO</span>
                    <span className="font-medium">N°: {budgetNumber}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">Cliente:</span>
                    <p>{clientName || "Sin especificar"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span>
                    <p>{new Date().toLocaleDateString('es-MX')}</p>
                  </div>
                  {clientRIF && (
                    <div className="col-span-2">
                      <span className="font-medium">RIF Cliente:</span>
                      <p>{clientRIF}</p>
                    </div>
                  )}
                </div>

                <div className="border rounded p-3 mb-4 bg-background">
                  <h4 className="font-semibold mb-2">MATERIALES</h4>
                  {products.length > 0 ? (
                    <div className="space-y-2">
                      {products.map((product, index) => (
                        <div key={index} className="text-xs border-b pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{index + 1}. {product.name.toUpperCase()}</p>
                              <p>Medida: {product.width} x {product.height}m</p>
                              <p>Precio: {formatAmount(convertAmount(product.price))} {product.unit === 'pieza' ? 'por pieza' : 'por m²'}</p>
                            </div>
                            <div className="text-right">
                              <p>Cant: {product.unit === 'pieza' ? product.quantity : (product.width * product.height).toFixed(2)} {product.unit === 'pieza' ? 'pzs' : 'm²'}</p>
                              <p className="font-bold">{formatAmount(convertAmount(product.total))}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">No hay productos agregados</p>
                  )}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatAmount(subtotal)}</span>
                  </div>
                  
                  {includeIVA && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>IVA (16%):</span>
                      <span className="font-medium text-warning">{formatAmount(iva)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>TOTAL GENERAL:</span>
                    <span className="text-primary">{formatAmount(total)}</span>
                  </div>
                </div>

                {notes && (
                  <div className="border-t pt-3 mt-3">
                    <span className="font-medium text-sm">Notas:</span>
                    <p className="text-xs text-muted-foreground mt-1">{notes}</p>
                  </div>
                )}
              </div>

              {products.length === 0 && (
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    ⚠️ Agregue productos en la pestaña "Productos" para generar el presupuesto.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};