import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Plus, Trash2, Package } from "lucide-react";
import { Product } from "./ProductForm";
import { useCurrency } from "./CurrencyProvider";

interface Material {
  id: string;
  name: string;
  cost: number;
  unit: string;
  quantityNeeded: number;
  totalCost: number;
}

interface CostData {
  materials: Material[];
  laborCost: number;
  overhead: number;
  notes: string;
}

interface MaterialCostCalculatorProps {
  products: Product[];
}

export const MaterialCostCalculator = ({ products }: MaterialCostCalculatorProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [laborCost, setLaborCost] = useState(0);
  const [overhead, setOverhead] = useState(0);
  const [notes, setNotes] = useState("");
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    cost: "",
    unit: "unidad",
    quantityNeeded: ""
  });

  const { formatAmount, convertAmount, currency } = useCurrency();

  const totalProductValue = products.reduce((sum, product) => sum + convertAmount(product.total), 0);
  const totalMaterialCost = materials.reduce((sum, material) => sum + material.totalCost, 0);
  const totalCost = totalMaterialCost + laborCost + overhead;
  const profit = totalProductValue - totalCost;
  const profitMargin = totalProductValue > 0 ? (profit / totalProductValue) * 100 : 0;

  useEffect(() => {
    const savedData = localStorage.getItem('viford-costs');
    if (savedData) {
      const data: CostData = JSON.parse(savedData);
      setMaterials(data.materials || []);
      setLaborCost(data.laborCost || 0);
      setOverhead(data.overhead || 0);
      setNotes(data.notes || "");
    }
  }, []);

  useEffect(() => {
    const costData: CostData = {
      materials,
      laborCost,
      overhead,
      notes
    };
    localStorage.setItem('viford-costs', JSON.stringify(costData));
  }, [materials, laborCost, overhead, notes]);

  const addMaterial = () => {
    if (!newMaterial.name || !newMaterial.cost || !newMaterial.quantityNeeded) return;

    const cost = parseFloat(newMaterial.cost);
    const quantity = parseFloat(newMaterial.quantityNeeded);
    
    const material: Material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      cost: cost,
      unit: newMaterial.unit,
      quantityNeeded: quantity,
      totalCost: cost * quantity
    };

    setMaterials([...materials, material]);
    setNewMaterial({ name: "", cost: "", unit: "unidad", quantityNeeded: "" });
  };

  const removeMaterial = (materialId: string) => {
    setMaterials(materials.filter(m => m.id !== materialId));
  };

  const updateMaterial = (materialId: string, field: keyof Material, value: string | number) => {
    setMaterials(materials.map(material => {
      if (material.id === materialId) {
        const updated = { ...material, [field]: value };
        if (field === 'cost' || field === 'quantityNeeded') {
          updated.totalCost = updated.cost * updated.quantityNeeded;
        }
        return updated;
      }
      return material;
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-warning to-warning/90 text-warning-foreground">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Costos por Materiales
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agregar Materiales */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Material
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label>Nombre del Material</Label>
                    <Input
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                      placeholder="Tubo galvanizado, alambre, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Costo Unitario ({currency})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newMaterial.cost}
                        onChange={(e) => setNewMaterial({...newMaterial, cost: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Unidad</Label>
                      <Input
                        value={newMaterial.unit}
                        onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                        placeholder="metro, kg, unidad"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Cantidad Necesaria</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newMaterial.quantityNeeded}
                      onChange={(e) => setNewMaterial({...newMaterial, quantityNeeded: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <Button onClick={addMaterial} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Material
                  </Button>
                </div>
              </div>

              {/* Costos Adicionales */}
              <div className="space-y-3">
                <div>
                  <Label>Costo de Mano de Obra ({currency})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Gastos Generales ({currency})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={overhead}
                    onChange={(e) => setOverhead(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Transporte, electricidad, herramientas, etc.
                  </p>
                </div>

                <div>
                  <Label>Notas de Costos</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Consideraciones especiales, proveedores, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Lista de Materiales y Resumen */}
            <div className="space-y-4">
              {/* Lista de Materiales */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Materiales Agregados ({materials.length})
                </h4>
                
                {materials.length === 0 ? (
                  <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay materiales agregados</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {materials.map((material) => (
                      <div key={material.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <Input
                              value={material.name}
                              onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                              className="font-medium mb-1"
                            />
                            <div className="grid grid-cols-3 gap-1 text-xs">
                              <div>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={material.cost}
                                  onChange={(e) => updateMaterial(material.id, 'cost', parseFloat(e.target.value) || 0)}
                                  placeholder="Costo"
                                />
                              </div>
                              <div>
                                <Input
                                  value={material.unit}
                                  onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                                  placeholder="Unidad"
                                />
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={material.quantityNeeded}
                                  onChange={(e) => updateMaterial(material.id, 'quantityNeeded', parseFloat(e.target.value) || 0)}
                                  placeholder="Cantidad"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 text-right">
                            <div className="font-semibold text-primary">
                              {formatAmount(material.totalCost)}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeMaterial(material.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen de Costos */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Resumen de Costos</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Total de Productos:</span>
                    <span className="font-medium text-success">{formatAmount(totalProductValue)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Materiales:</span>
                      <span>{formatAmount(totalMaterialCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mano de Obra:</span>
                      <span>{formatAmount(laborCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gastos Generales:</span>
                      <span>{formatAmount(overhead)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total Costos:</span>
                    <span className="text-warning">{formatAmount(totalCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Ganancia:</span>
                    <span className={profit >= 0 ? 'text-success' : 'text-destructive'}>
                      {formatAmount(profit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Margen de Ganancia:</span>
                    <span className={profit >= 0 ? 'text-success' : 'text-destructive'}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};