import React, { useMemo, useState } from 'react';
import {
  Sprout,
  LayoutDashboard,
  Package,
  TrendingUp,
  Globe,
  Users,
  ShieldCheck,
  Sparkles,
  Plus,
  Search,
  Calculator,
  QrCode,
  FileSpreadsheet,
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_TRADES, INITIAL_OPPORTUNITIES } from './data/initialData';
import { CrmOpportunity, ProductItem, TradeOperation, UserRole } from './types';

const ROLES: UserRole[] = [
  'Administrador General',
  'Gerente',
  'Productor',
  'Proveedor',
  'Exportador',
  'Importador',
  'Vendedor',
  'Contador',
  'Responsable de Inventario',
  'Transportista',
  'Cliente',
];

export default function App() {
  const [role, setRole] = useState<UserRole>('Administrador General');
  const [activeModule, setActiveModule] = useState<'dashboard' | 'erp' | 'crm' | 'comex' | 'ia'>('dashboard');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [trades, setTrades] = useState<TradeOperation[]>(INITIAL_TRADES);
  const [opportunities, setOpportunities] = useState<CrmOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [search, setSearch] = useState('');

  // Calculadora de Comercio Exterior (Estimación configurable - Simulación)
  const [fobVal, setFobVal] = useState<number>(25000);
  const [freightVal, setFreightVal] = useState<number>(2200);
  const [insuranceVal, setInsuranceVal] = useState<number>(300);
  const [tariffRate, setTariffRate] = useState<number>(10);
  const [customsFee, setCustomsFee] = useState<number>(450);

  // Nuevo producto rápido en ERP
  const [newProdName, setNewProdName] = useState('');
  const [newProdOrigin, setNewProdOrigin] = useState('Tulcán, Carchi');
  const [newProdStock, setNewProdStock] = useState<number>(150);
  const [newProdPrice, setNewProdPrice] = useState<number>(22);

  // Asistente CampoIA
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLog, setAiLog] = useState<Array<{ from: 'user' | 'ai'; text: string }>>([
    {
      from: 'ai',
      text: 'Hola, soy CampoIA. Puedo ayudarte a analizar inventarios (como Papa Superchola en Carchi), estimar costos FOB/CIF o identificar oportunidades en Colombia, EE.UU. y la Unión Europea.',
    },
  ]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.origin.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).length,
    [products]
  );

  const cifTotal = fobVal + freightVal + insuranceVal;
  const taxEstimate = (cifTotal * tariffRate) / 100;
  const landedCost = cifTotal + taxEstimate + customsFee;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const item: ProductItem = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      sku: `EC-${Math.floor(100 + Math.random() * 899)}`,
      name: newProdName.trim(),
      category: 'Agrícola',
      origin: newProdOrigin,
      producer: 'Productor Registrado CampoDirecto',
      unit: 'quintales',
      stock: Number(newProdStock) || 0,
      minStock: 50,
      buyPrice: Number((newProdPrice * 0.78).toFixed(2)),
      sellPrice: Number(newProdPrice) || 0,
      harvestDate: new Date().toISOString().split('T')[0],
      lot: `LOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`,
      quality: 'Calidad Verificada',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    setProducts([item, ...products]);
    setNewProdName('');
  };

  const handleExportCsv = () => {
    const headers = ['ID,SKU,Producto,Origen,Unidad,Stock,PrecioVenta,Lote,BlockchainTx'];
    const rows = products.map(
      (p) =>
        `${p.id},${p.sku},"${p.name}","${p.origin}",${p.unit},${p.stock},${p.sellPrice},${p.lot},${p.txHash}`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campodirecto_inventario_trazabilidad.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const question = aiPrompt.trim();
    const q = question.toLowerCase();
    let answer =
      'Según los datos demostrativos activos, la rotación en Sierra Norte (Carchi) y exportación de frutas/cacao mantiene márgenes atractivos cuando se consolida carga.';
    if (q.includes('papa') || q.includes('carchi') || q.includes('stock')) {
      answer = `Alerta de inventario: tienes ${lowStockCount} producto(s) por debajo del stock mínimo. Para Papa Superchola en Carchi, consolidar envíos hacia Quito o Ipiales (Colombia) reduce el flete unitario.`;
    } else if (q.includes('cif') || q.includes('fob') || q.includes('arancel')) {
      answer = `En la calculadora actual: FOB $${fobVal.toLocaleString()} + Flete $${freightVal.toLocaleString()} + Seguro $${insuranceVal.toLocaleString()} = CIF $${cifTotal.toLocaleString()}. Costo total estimado con tributos (${tariffRate}%): $${landedCost.toLocaleString()} (estimación simulada).`;
    }
    setAiLog([...aiLog, { from: 'user', text: question }, { from: 'ai', text: answer }]);
    setAiPrompt('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F2] text-slate-900">
      {/* Barra superior */}
      <header className="bg-[#174D32] text-white px-4 py-3 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D5A642] text-[#174D32] flex items-center justify-center font-extrabold">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight">
                Campo<span className="text-[#D5A642]">Directo</span> ERP + CRM
              </h1>
              <p className="text-[11px] text-emerald-100">
                Del productor al mundo, sin fronteras • Datos demostrativos / simulación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <ShieldCheck className="w-4 h-4 text-[#D5A642]" />
            <label className="text-xs text-emerald-100">Rol:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="text-slate-900">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Navegación principal */}
      <nav className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: LayoutDashboard },
            { id: 'erp', label: 'ERP Inventario y Trazabilidad', icon: Package },
            { id: 'crm', label: 'CRM Embudo Comercial', icon: Users },
            { id: 'comex', label: 'Comercio Exterior y Calculadora', icon: Globe },
            { id: 'ia', label: 'CampoIA y Gemelo Digital', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as typeof activeModule)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  active
                    ? 'bg-[#174D32] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#D5A642]' : 'text-[#36834A]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {activeModule === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Productos Registrados</p>
                <p className="text-2xl font-extrabold text-[#174D32] mt-1">{products.length}</p>
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  Alertas stock bajo: {lowStockCount}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Operaciones Comex (Simulación)</p>
                <p className="text-2xl font-extrabold text-[#36834A] mt-1">{trades.length}</p>
                <p className="text-xs text-slate-500 mt-1">Exportaciones e Importaciones</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Pipeline CRM Activo</p>
                <p className="text-2xl font-extrabold text-[#174D32] mt-1">
                  ${opportunities.reduce((acc, o) => acc + o.value, 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">{opportunities.length} oportunidades</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Sesión Activa</p>
                <p className="text-lg font-extrabold text-[#D5A642] mt-1">{role}</p>
                <p className="text-xs text-slate-500 mt-1">Trazabilidad QR + Blockchain</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#174D32]">
                    Operaciones de Comercio Exterior (Demostración)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Seguimiento de Incoterms 2020, partidas arancelarias y rutas desde Ecuador.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModule('comex')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D5A642] text-[#174D32]"
                >
                  Abrir Calculadora Comex
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8F2] text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Contraparte</th>
                      <th className="py-2.5 px-3">Producto</th>
                      <th className="py-2.5 px-3">Incoterm</th>
                      <th className="py-2.5 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trades.map((t) => (
                      <tr key={t.id}>
                        <td className="py-2.5 px-3 font-bold">{t.id}</td>
                        <td className="py-2.5 px-3">{t.type}</td>
                        <td className="py-2.5 px-3">
                          {t.partner} ({t.country})
                        </td>
                        <td className="py-2.5 px-3">{t.product}</td>
                        <td className="py-2.5 px-3 font-bold text-[#174D32]">{t.incoterm}</td>
                        <td className="py-2.5 px-3 text-slate-600">{t.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeModule === 'erp' && (
          <div className="space-y-6">
            <form
              onSubmit={handleAddProduct}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
            >
              <div>
                <label className="block text-xs font-bold mb-1">Producto Agrícola</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ej. Cebolla Colorada"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Origen (Ecuador)</label>
                <input
                  type="text"
                  value={newProdOrigin}
                  onChange={(e) => setNewProdOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Stock (quintales)</label>
                <input
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Precio Venta (USD)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#174D32] text-white"
              >
                <Plus className="w-4 h-4" /> Registrar Lote
              </button>
            </form>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por SKU, producto u origen..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#36834A] text-white"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Descargar Reporte CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8F2] text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3">SKU / Lote</th>
                      <th className="py-2.5 px-3">Producto</th>
                      <th className="py-2.5 px-3">Origen</th>
                      <th className="py-2.5 px-3 text-right">Stock</th>
                      <th className="py-2.5 px-3 text-right">Precio Venta</th>
                      <th className="py-2.5 px-3">Trazabilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isLow = p.stock <= p.minStock;
                      return (
                        <tr key={p.id}>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="font-bold text-[#174D32]">{p.sku}</span>
                            <span className="block text-[10px] text-slate-400">{p.lot}</span>
                          </td>
                          <td className="py-2.5 px-3 font-bold">{p.name}</td>
                          <td className="py-2.5 px-3">{p.origin}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {p.stock} {p.unit}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#174D32]">
                            ${p.sellPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <QrCode className="w-3.5 h-3.5 text-[#36834A]" /> {p.txHash}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'crm' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#174D32]">
              CRM Comercial — Oportunidades Nacionales e Internacionales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['Prospecto', 'Cotizado', 'Negociación', 'Cerrado'] as const).map((stage) => (
                <div key={stage} className="bg-[#F7F8F2] p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase text-[#174D32]">{stage}</h3>
                  {opportunities
                    .filter((o) => o.stage === stage)
                    .map((opp) => (
                      <div key={opp.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <p className="text-xs font-bold text-slate-900">{opp.client}</p>
                        <p className="text-[11px] text-slate-500">{opp.country}</p>
                        <p className="text-[11px] text-slate-700">{opp.product}</p>
                        <p className="text-xs font-extrabold text-[#36834A] pt-1">
                          ${opp.value.toLocaleString()} USD
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModule === 'comex' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#174D32]" />
              <h2 className="text-lg font-extrabold text-[#174D32]">
                Calculadora de Comercio Exterior (Estimación Referencial)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Estimación configurable para evaluación comercial. No sustituye una liquidación aduanera oficial.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Valor FOB (USD)</label>
                <input
                  type="number"
                  value={fobVal}
                  onChange={(e) => setFobVal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Flete Internacional (USD)</label>
                <input
                  type="number"
                  value={freightVal}
                  onChange={(e) => setFreightVal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Seguro (USD)</label>
                <input
                  type="number"
                  value={insuranceVal}
                  onChange={(e) => setInsuranceVal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Tributo Estimado (%)</label>
                <input
                  type="number"
                  value={tariffRate}
                  onChange={(e) => setTariffRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Gastos Aduana/Puerto (USD)</label>
                <input
                  type="number"
                  value={customsFee}
                  onChange={(e) => setCustomsFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-slate-200">
                <p className="text-xs text-slate-500">Valor CIF Estimado</p>
                <p className="text-xl font-extrabold text-[#174D32]">${cifTotal.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-slate-200">
                <p className="text-xs text-slate-500">Tributos Estimados ({tariffRate}%)</p>
                <p className="text-xl font-extrabold text-[#36834A]">${taxEstimate.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#174D32] text-white">
                <p className="text-xs text-emerald-100">Costo Total Estimado</p>
                <p className="text-xl font-extrabold text-[#D5A642]">${landedCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'ia' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#174D32]">
              CampoIA — Asistente Agrícola y Comercio Exterior
            </h2>
            <div className="space-y-2.5 max-h-72 overflow-y-auto p-4 rounded-2xl bg-[#F7F8F2] border border-slate-200">
              {aiLog.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs max-w-xl ${
                    m.from === 'ai'
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-[#174D32] text-white ml-auto'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleAskAi} className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Pregunta sobre stock en Carchi, costos CIF o exportación..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#174D32] text-white"
              >
                Consultar
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}