import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

interface ClockState {
  format24h: boolean;
  toggleFormat: () => void;
}

const stores = new Map<string, ReturnType<typeof createClockStore>>();

function createClockStore() {
  return createStore<ClockState>((set) => ({
    format24h: true,
    toggleFormat: () => set((state) => ({ format24h: !state.format24h })),
  }));
}

export function useClockStore(instanceId: string) {
  if (!stores.has(instanceId)) {
    stores.set(instanceId, createClockStore());
  }
  return useStore(stores.get(instanceId)!);
}
