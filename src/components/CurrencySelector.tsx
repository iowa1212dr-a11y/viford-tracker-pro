import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowRightLeft } from "lucide-react";
import { useCurrency } from "./CurrencyProvider";
import { useState } from "react";

export const CurrencySelector = () => {
  const { currency, setCurrency, exchangeRate, setExchangeRate } = useCurrency();
  const [tempRate, setTempRate] = useState(exchangeRate.toString());

  const handleRateChange = () => {
    const rate = parseFloat(tempRate);
    if (rate > 0) {
      setExchangeRate(rate);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-accent to-accent/90 text-accent-foreground">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Configuración de Moneda
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Moneda Actual</Label>
            <div className="flex gap-2">
              <Button
                variant={currency === 'USD' ? 'default' : 'outline'}
                onClick={() => setCurrency('USD')}
                className="flex-1"
              >
                USD ($)
              </Button>
              <Button
                variant={currency === 'VES' ? 'default' : 'outline'}
                onClick={() => setCurrency('VES')}
                className="flex-1"
              >
                VES (Bs.)
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="exchange-rate" className="text-sm font-medium mb-2 block">
              Tasa de Cambio (1 USD = X Bs.)
            </Label>
            <div className="flex gap-2">
              <Input
                id="exchange-rate"
                type="number"
                step="0.01"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                placeholder="36.50"
                className="flex-1"
              />
              <Button onClick={handleRateChange} size="sm">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasa actual: 1 USD = {exchangeRate} Bs.
            </p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Los precios se mostrarán en <strong>{currency === 'USD' ? 'Dólares' : 'Bolívares'}</strong>.
              Cambiar la moneda convertirá automáticamente todos los valores.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};