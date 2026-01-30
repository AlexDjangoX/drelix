/**
 * Koszula (work shirts) product images in public/koszula.
 */
export const KOSZULA = [
  { id: 'koszula-1', src: '/koszula/received_1187296065304596.jpeg', name: 'Koszula 1' },
  { id: 'koszula-2', src: '/koszula/received_6277265022296957.jpeg', name: 'Koszula 2' },
  { id: 'koszula-3', src: '/koszula/received_938134320716791.jpeg', name: 'Koszula 3' },
] as const;

export type KoszulaId = (typeof KOSZULA)[number]['id'];
