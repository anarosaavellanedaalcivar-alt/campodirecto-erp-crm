export type UserRole =
  | 'Administrador General'
  | 'Gerente'
  | 'Productor'
  | 'Proveedor'
  | 'Exportador'
  | 'Importador'
  | 'Vendedor'
  | 'Contador'
  | 'Responsable de Inventario'
  | 'Transportista'
  | 'Cliente';

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  origin: string;
  producer: string;
  unit: 'kg' | 'quintales' | 'toneladas' | 'cajas' | 'sacos';
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  harvestDate: string;
  lot: string;
  quality: string;
  txHash: string;
}

export interface TradeOperation {
  id: string;
  type: 'EXPORT' | 'IMPORT';
  partner: string;
  country: string;
  product: string;
  incoterm: 'FOB' | 'CIF' | 'EXW' | 'DDP';
  hsCode: string;
  fob: number;
  freight: number;
  insurance: number;
  taxes: number;
  status: string;
}

export interface CrmOpportunity {
  id: string;
  client: string;
  country: string;
  segment: 'Mayorista' | 'Importador' | 'Supermercado' | 'Agroindustria';
  stage: 'Prospecto' | 'Cotizado' | 'Negociación' | 'Cerrado';
  value: number;
  product: string;
}