import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Truck, Download, Camera, X } from "lucide-react";
import { Budget } from "./BudgetGenerator";
import { usePDFExport } from "@/hooks/usePDFExport";

interface DeliveryNoteProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TransportData {
  transportedBy: string;
  cedula: string;
  placa: string;
  vehicleModel: string;
}

export const DeliveryNote = ({ budget, open, onOpenChange }: DeliveryNoteProps) => {
  const [transportData, setTransportData] = useState<TransportData>({
    transportedBy: '',
    cedula: '',
    placa: '',
    vehicleModel: ''
  });

  const { exportToPDF, captureAsImage } = usePDFExport();

  const handleInputChange = (field: keyof TransportData, value: string) => {
    setTransportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Nota de Entrega - {budget.clientName}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => exportToPDF('delivery-note-content', `Nota-Entrega-${budget.budgetNumber}-${budget.clientName}`)}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                size="sm"
                onClick={() => captureAsImage('delivery-note-content', `Nota-Entrega-${budget.budgetNumber}-${budget.clientName}`)}
                variant="outline"
              >
                <Camera className="h-4 w-4 mr-2" />
                Imagen
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campos de Transporte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos de Transporte</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transportedBy">Transportado por</Label>
                <Input
                  id="transportedBy"
                  value={transportData.transportedBy}
                  onChange={(e) => handleInputChange('transportedBy', e.target.value)}
                  placeholder="Nombre del transportista"
                />
              </div>
              <div>
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  value={transportData.cedula}
                  onChange={(e) => handleInputChange('cedula', e.target.value)}
                  placeholder="Cédula del transportista"
                />
              </div>
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={transportData.placa}
                  onChange={(e) => handleInputChange('placa', e.target.value)}
                  placeholder="Placa del vehículo"
                />
              </div>
              <div>
                <Label htmlFor="vehicleModel">Modelo de Vehículo</Label>
                <Input
                  id="vehicleModel"
                  value={transportData.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  placeholder="Modelo del vehículo"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vista Previa de la Nota de Entrega */}
          <Card>
            <CardContent className="p-0">
              <div id="delivery-note-content" className="p-6 bg-background">
                {/* Encabezado de la Empresa */}
                <div className="text-center border-b pb-4 mb-6">
                  <h2 className="font-bold text-xl text-primary">
                    {budget.companyName || "EMPRESA VIFORD PRO C.A."}
                  </h2>
                  {budget.companyRIF && (
                    <p className="text-sm text-muted-foreground">RIF: {budget.companyRIF}</p>
                  )}
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="font-bold text-lg">NOTA DE ENTREGA</span>
                    <span className="font-medium">N°: {budget.budgetNumber}</span>
                  </div>
                </div>
                
                {/* Datos del Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="font-semibold">Cliente:</span>
                    <p className="mt-1">{budget.clientName}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Fecha:</span>
                    <p className="mt-1">{budget.date}</p>
                  </div>
                  {budget.clientAddress && (
                    <div className="col-span-full">
                      <span className="font-semibold">Dirección:</span>
                      <p className="mt-1">{budget.clientAddress}</p>
                    </div>
                  )}
                  {budget.clientRIF && (
                    <div className="col-span-full">
                      <span className="font-semibold">RIF/Cédula Cliente:</span>
                      <p className="mt-1">{budget.clientRIF}</p>
                    </div>
                  )}
                </div>

                {/* Materiales Entregados */}
                <div className="border rounded-lg p-4 mb-6 bg-muted/30">
                  <h4 className="font-bold mb-4 text-center">MATERIALES ENTREGADOS</h4>
                  <div className="space-y-3">
                    {budget.products.map((product, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {index + 1}. {product.name.toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Medida: {product.unit === 'metro' ? `${product.quantity} x ${product.height}m` : `${product.width} x ${product.height}m`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              Cantidad: {product.unit === 'pieza' ? product.quantity : product.quantity} {product.unit === 'pieza' ? 'piezas' : 'ml'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Datos de Transporte */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-bold mb-4 text-center">DATOS DE TRANSPORTE</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Transportado por:</span>
                      <p className="mt-1 border-b border-dotted pb-1">
                        {transportData.transportedBy || '________________________________'}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold">Cédula:</span>
                      <p className="mt-1 border-b border-dotted pb-1">
                        {transportData.cedula || '________________________________'}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold">Placa:</span>
                      <p className="mt-1 border-b border-dotted pb-1">
                        {transportData.placa || '________________________________'}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold">Modelo de Vehículo:</span>
                      <p className="mt-1 border-b border-dotted pb-1">
                        {transportData.vehicleModel || '________________________________'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Firmas */}
                <div className="grid grid-cols-2 gap-8 mt-8 pt-6">
                  <div className="text-center">
                    <div className="border-t border-foreground mt-12 pt-2">
                      <p className="text-sm font-medium">Firma del Cliente</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-foreground mt-12 pt-2">
                      <p className="text-sm font-medium">Firma del Transportista</p>
                    </div>
                  </div>
                </div>

                {budget.notes && (
                  <div className="border-t pt-4 mt-6">
                    <span className="font-semibold text-sm">Observaciones:</span>
                    <p className="text-sm text-muted-foreground mt-2">{budget.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};