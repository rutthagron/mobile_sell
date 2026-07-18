import { create } from 'zustand';

export const useCartStore = create((set) => ({
  customer: null,
  items: [], // { scannedCode, idPro, proName, num, unit, matchedBy }
  note: '',

  setCustomer: (customer) => set({ customer }),
  setNote: (note) => set({ note }),

  addItem: (item) =>
    set((state) => {
      // Merge with an existing line matching the same scanned code + unit.
      const idx = state.items.findIndex(
        (i) => i.scannedCode === item.scannedCode && i.unit === item.unit
      );
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], num: items[idx].num + item.num };
        return { items };
      }
      return { items: [...state.items, item] };
    }),

  updateNum: (index, num) =>
    set((state) => {
      const items = [...state.items];
      items[index] = { ...items[index], num };
      return { items };
    }),

  removeItem: (index) =>
    set((state) => ({ items: state.items.filter((_, i) => i !== index) })),

  clear: () => set({ items: [], note: '', customer: null }),
}));
