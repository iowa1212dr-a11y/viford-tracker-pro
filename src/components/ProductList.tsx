import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Package } from "lucide-react";
import { Product } from "./ProductForm";

interface ProductListProps {
  products: Product[];
  onRemoveProduct: (id: string) => void;
}

export const ProductList = ({ products, onRemoveProduct }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay productos agregados</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-accent to-accent/90 text-accent-foreground">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Lista de Productos ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`p-4 border-b border-border last:border-b-0 ${
                index % 2 === 0 ? 'bg-card' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                    <Badge variant={product.unit === 'metro' ? 'default' : 'secondary'}>
                      {product.unit === 'metro' ? 'Metro Lineal' : 'Pieza'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Medidas:</span> 
                      {product.unit === 'metro' 
                        ? `${product.quantity} × ${product.height}m`
                        : `${product.width}m × ${product.height}m`
                      }
                    </div>
                    <div>
                      <span className="font-medium">Cantidad:</span> {product.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Precio:</span> {formatCurrency(product.price)}
                      {product.unit === 'metro' ? '/ml' : (product.unit === 'pieza' ? '/pza' : '')}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> 
                      <span className="font-bold text-primary ml-1">
                        {formatCurrency(product.total)}
                      </span>
                    </div>
                  </div>

                  {product.unit === 'metro' && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Total metros lineales: {product.quantity} ml
                    </div>
                  )}
                </div>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveProduct(product.id)}
                  className="ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};