
export interface PnLAccount {
  name: string;
  value: number;
  category: string;
}

export interface PnLSection {
  accounts: PnLAccount[];
  total: number;
}

export interface PnLData {
  companyName: string;
  period: string;
  basisType: string;
  reportType: string;
  sections: {
    tradingIncome: PnLSection;
    costOfSales: PnLSection;
    grossProfit: number;
    operatingExpenses: PnLSection;
    netProfit: number;
  };
  metadata: {
    uploadDate: string;
    source: string;
    currency: string;
  };
}
