import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Share2, User, Building, Calendar } from "lucide-react";
import { Product } from "./ProductForm";
import { useToast } from "@/hooks/use-toast";

interface BudgetGeneratorProps {
  products: Product[];
}

export interface Budget {
  id: string;
  clientName: string;  
  clientRIF: string;
  notes: string;
  date: string;
  products: Product[];
  includeIVA: boolean;
  subtotal: number;
  iva: number;
  total: number;
}

export const BudgetGenerator = ({ products }: BudgetGeneratorProps) => {
  const [clientName, setClientName] = useState("");
  const [clientRIF, setClientRIF] = useState("");
  const [notes, setNotes] = useState("");
  const [includeIVA, setIncludeIVA] = useState(true);
  
  const { toast } = useToast();

  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const iva = includeIVA ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

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
      clientName,
      clientRIF,
      notes,
      date: new Date().toLocaleDateString('es-MX'),
      products: [...products],
      includeIVA,
      subtotal,
      iva,
      total
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

    // Limpiar formulario
    setClientName("");
    setClientRIF("");
    setNotes("");
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

    const shareText = `PRESUPUESTO MALLA VIFORD PRO\n\n` +
      `Cliente: ${clientName}\n` +
      `${clientRIF ? `RIF: ${clientRIF}\n` : ''}` +
      `Fecha: ${new Date().toLocaleDateString('es-MX')}\n\n` +
      `PRODUCTOS:\n` +
      products.map(p => 
        `• ${p.name} - ${p.width}x${p.height}m - ${p.unit === 'pieza' ? 'Por pieza' : 'Por m²'} - ${formatCurrency(p.total)}`
      ).join('\n') +
      `\n\nSUBTOTAL: ${formatCurrency(subtotal)}\n` +
      `${includeIVA ? `IVA (16%): ${formatCurrency(iva)}\n` : ''}` +
      `TOTAL: ${formatCurrency(total)}\n` +
      `${notes ? `\nNotas: ${notes}` : ''}`;

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
            {/* Información del Cliente */}
            <div className="space-y-4">
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
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" />
                  <h3 className="font-semibold">Vista Previa del Presupuesto</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Cliente:</span> {clientName || "Sin especificar"}
                  </div>
                  {clientRIF && (
                    <div>
                      <span className="font-medium">RIF:</span> {clientRIF}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Fecha:</span> {new Date().toLocaleDateString('es-MX')}
                  </div>
                  <div>
                    <span className="font-medium">Productos:</span> {products.length}
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {includeIVA && (
                      <div className="flex justify-between">
                        <span>IVA (16%):</span>
                        <span className="font-medium text-warning">{formatCurrency(iva)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {notes && (
                    <div className="border-t pt-2 mt-2">
                      <span className="font-medium">Notas:</span>
                      <p className="text-xs text-muted-foreground mt-1">{notes}</p>
                    </div>
                  )}
                </div>
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