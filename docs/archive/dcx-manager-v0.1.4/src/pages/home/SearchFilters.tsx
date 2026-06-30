import React, { useState } from 'react';
import { motion } from "motion/react";
import { Search, Filter, Save, X as CloseIcon } from "lucide-react";
import { RightSidebar } from "../../components/RightSidebar";
import { FilterState, VersionStatus, SavedView } from "../../types";
import { MOCK_DCX_TABLE } from "../../mock/dcx";

interface SearchFiltersProps {
  isDark: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  savedViews: SavedView[];
  activeViewId: string | null;
  onSaveView: (name: string, filters: FilterState) => void;
  onSelectView: (view: SavedView) => void;
  onDeleteView: (id: string) => void;
}

const STATUS_OPTIONS: VersionStatus[] = ['Draft', 'In Progress', 'Ready for Review', 'Approved', 'Rejected', 'Placed'];

export function SearchFilters({ 
  isDark, 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  savedViews,
  activeViewId,
  onSaveView,
  onSelectView,
  onDeleteView
}: SearchFiltersProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const clients = Array.from(new Set(MOCK_DCX_TABLE.map(d => d.client)));
  const products = Array.from(new Set(MOCK_DCX_TABLE.map(d => d.product)));

  const toggleFilter = (type: keyof FilterState, value: string | VersionStatus) => {
    const current = filters[type] as (string | VersionStatus)[];
    const isSelected = current.includes(value);
    
    onFiltersChange({
      ...filters,
      [type]: isSelected 
        ? current.filter(v => v !== value)
        : [...current, value]
    });
  };

  const handleSaveViewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newViewName.trim()) {
      onSaveView(newViewName, filters);
      setNewViewName("");
      setIsSaving(false);
    }
  };

  const activeFiltersCount = filters.status.length + filters.clients.length + filters.products.length;

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 w-full"
      >
        <div className={`group flex-1 flex items-center gap-4 px-8 py-3.5 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-black/40 border-white/5 focus-within:border-primary/40 focus-within:bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.2)]' 
            : 'bg-white/60 border-black/5 focus-within:border-black/20 focus-within:bg-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
        }`}>
          <Search className={`w-4 h-4 transition-colors duration-500 ${isDark ? 'text-white/20 group-focus-within:text-primary' : 'text-black/30'}`} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search versions, projects or products..." 
            className={`bg-transparent border-none outline-none w-full font-medium text-sm placeholder:text-neutral-600 transition-colors ${isDark ? 'text-white' : 'text-black'}`}
          />
        </div>

        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`relative flex items-center gap-3 px-8 py-3.5 rounded-2xl border cursor-pointer active:scale-[0.96] transition-all duration-500 group/filter ${
            isDark 
              ? 'bg-black/40 border-white/5 text-white/40 hover:bg-black/60 hover:border-primary/40 hover:text-white shadow-[0_0_20px_rgba(0,0,0,0.2)]' 
              : 'bg-white/60 border-black/5 text-black/50 hover:bg-white/80 hover:border-black/20 hover:text-black shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
          }`}
        >
          <Filter className={`w-4 h-4 transition-colors duration-500 ${isDark ? 'group-hover/filter:text-primary' : ''}`} />
          <span className="text-xs font-bold tracking-[0.1em]">Filters</span>
          {activeFiltersCount > 0 && (
            <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-black text-[10px] font-black flex items-center justify-center border-2 ${
              isDark ? 'border-neutral-900 shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'border-white shadow-lg'
            }`}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2"
      >
        {savedViews.map((view) => (
          <div key={view.id} className="relative group/tag">
            <button 
              onClick={() => onSelectView(view)}
              className={`py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all duration-300 border flex items-center gap-2 relative ${
                view.isDefault ? 'px-4' : 'pl-4 pr-9'
              } ${
                activeViewId === view.id 
                  ? (isDark ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-black text-white border-black')
                  : (isDark ? 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10' : 'bg-black/5 border-black/5 text-black/40 hover:bg-black/10')
              }`}
            >
              {view.name}
            </button>
            {!view.isDefault && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteView(view.id);
                }}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-all duration-200 bg-white/10 hover:bg-rose-500 hover:text-white ${
                  isDark ? 'text-white/40' : 'text-black/40'
                }`}
              >
                <CloseIcon className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}

        {activeFiltersCount > 0 && !activeViewId && (
          <button 
            onClick={() => setIsSaving(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight border animate-pulse ${
              isDark ? 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10' : 'border-black/40 text-black bg-black/5 hover:bg-black/10'
            }`}
          >
            <Save className="w-3 h-3" />
            <span>Save current view</span>
          </button>
        )}
      </motion.div>

      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="Advanced Filters"
        isDark={isDark}
      >
        <div className="space-y-10">
          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-[10px] font-bold tracking-[0.2em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Status</h4>
              {filters.status.length > 0 && (
                <button 
                  onClick={() => onFiltersChange({ ...filters, status: [] })}
                  className="text-[9px] font-bold text-primary tracking-widest hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => {
                const isSelected = filters.status.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status)}
                    className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary border-primary text-black' 
                        : isDark 
                          ? 'bg-white/5 border-white/5 text-white/40 hover:border-white/20' 
                          : 'bg-black/5 border-black/5 text-black/40 hover:border-black/20'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-[10px] font-bold tracking-[0.2em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Client</h4>
              {filters.clients.length > 0 && (
                <button 
                  onClick={() => onFiltersChange({ ...filters, clients: [] })}
                  className="text-[9px] font-bold text-primary tracking-widest hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {clients.map((client) => {
                const isSelected = filters.clients.includes(client);
                return (
                  <button
                    key={client}
                    onClick={() => toggleFilter('clients', client)}
                    className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary border-primary text-black' 
                        : isDark 
                          ? 'bg-white/5 border-white/5 text-white/40 hover:border-white/20' 
                          : 'bg-black/5 border-black/5 text-black/40 hover:border-black/20'
                    }`}
                  >
                    {client}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-[10px] font-bold tracking-[0.2em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Product</h4>
              {filters.products.length > 0 && (
                <button 
                  onClick={() => onFiltersChange({ ...filters, products: [] })}
                  className="text-[9px] font-bold text-primary tracking-widest hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {products.map((product) => {
                const isSelected = filters.products.includes(product);
                return (
                  <button
                    key={product}
                    onClick={() => toggleFilter('products', product)}
                    className={`w-full text-left px-4 py-4 rounded-2xl border text-[11px] font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary border-primary text-black' 
                        : isDark 
                          ? 'bg-white/5 border-white/5 text-white/40 hover:border-white/20' 
                          : 'bg-black/5 border-black/5 text-black/40 hover:border-black/20'
                    }`}
                  >
                    {product}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onFiltersChange({ status: [], clients: [], products: [] });
                setIsSidebarOpen(false);
              }}
              className={`flex-1 py-4 rounded-2xl border transition-all duration-300 text-[11px] font-bold tracking-widest ${
                isDark 
                  ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/5' 
                  : 'border-black/10 text-black/40 hover:text-black hover:bg-black/5'
              }`}
            >
              Reset
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`flex-[2] py-4 rounded-2xl transition-all duration-300 text-[11px] font-bold tracking-widest ${
                isDark 
                  ? 'bg-primary text-black' 
                  : 'bg-black text-white'
              }`}
            >
              Show Results
            </button>
          </div>
        </div>
      </RightSidebar>

      <RightSidebar
        isOpen={isSaving}
        onClose={() => setIsSaving(false)}
        title="Name your view"
        isDark={isDark}
      >
        <form onSubmit={handleSaveViewSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-[10px] font-bold tracking-[0.2em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>
              View Name
            </label>
            <input 
              autoFocus
              type="text" 
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="e.g. My HSA Projects" 
              className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 text-sm font-bold ${
                isDark 
                  ? 'bg-black/20 border-white/10 text-white focus:border-primary/50 outline-none' 
                  : 'bg-white border-black/10 text-black focus:border-black/30 outline-none'
              }`}
            />
          </div>

          <div className="space-y-4">
            <h4 className={`text-[10px] font-bold tracking-[0.2em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Filters to be saved</h4>
            <div className="flex flex-wrap gap-2">
              {filters.status.map(s => <span key={s} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">{s}</span>)}
              {filters.clients.map(c => <span key={c} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-bold">{c}</span>)}
              {filters.products.map(p => <span key={p} className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-bold">{p}</span>)}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-primary text-black text-[11px] font-bold tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save view
          </button>
        </form>
      </RightSidebar>
    </div>
  );
}
