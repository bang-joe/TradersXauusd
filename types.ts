
export interface Analysis {
  trend: string;
  supportResistance: string;
  candlestick: string;
  indicators: string;
  recommendation: {
    entry: string;
    stopLoss: string;
    takeProfit: string;
  };
}
