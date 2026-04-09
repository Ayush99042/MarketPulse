import axios from 'axios';

export interface NSESockEntry {
  info: {
    symbol: string;
    companyName: string;
    industry: string;
    listingDate: string;
    isin: string;
    segment: string;
  };
  metadata: {
    series: string;
    status: string;
    industry: string;
    pdSectorPe: number;
    pdSymbolPe: number;
    pdSectorInd: string;
  };
  securityInfo: {
    faceValue: number;
    issuedSize: number;
    classOfShare: string;
  };
  priceInfo: {
    lastPrice: number;
    change: number;
    pChange: number;
    open: number;
    close: number;
    previousClose: number;
    vwap: number;
    intraDayHighLow: {
      min: number;
      max: number;
    };
    weekHighLow: {
      min: number;
      max: number;
      minDate: string;
      maxDate: string;
    };
    upperCP: number;
    lowerCP: number;
  };
  industryInfo: {
    macro: string;
    sector: string;
    industry: string;
    basicIndustry: string;
  };
}

export const fetchNSEQuote = async (symbol: string): Promise<NSESockEntry> => {
  try {
    const response = await axios.get(`/api-nse/api/quote-equity?symbol=${symbol}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
