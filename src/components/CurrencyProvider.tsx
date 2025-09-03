import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'Bs.';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('viford-currency');
    return (saved as Currency) || 'USD';
  });
  
  const [exchangeRate, setExchangeRate] = useState(() => {
    const saved = localStorage.getItem('viford-exchange-rate');
    return saved ? parseFloat(saved) : 36.5;
  });

  useEffect(() => {
    localStorage.setItem('viford-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('viford-exchange-rate', exchangeRate.toString());
  }, [exchangeRate]);

  const formatAmount = (amount: number) => {
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

  const convertAmount = (amount: number, fromCurrency: Currency = 'USD') => {
    if (currency === fromCurrency) return amount;
    
    if (fromCurrency === 'USD' && currency === 'Bs.') {
      return amount * exchangeRate;
    } else if (fromCurrency === 'Bs.' && currency === 'USD') {
      return amount / exchangeRate;
    }
    
    return amount;
  };

  const value = {
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
    formatAmount,
    convertAmount
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};