/**
 * Glove product images in public/gloves.
 * Display name is derived from filename (part before _ or dimensions).
 */
export const GLOVES = [
  { id: 'blutrix', src: '/gloves/BLUTRIX_672x1024.jpg', name: 'BLUTRIX' },
  { id: 'latefom', src: '/gloves/LATEFOM_642x1024.jpg', name: 'LATEFOM' },
  { id: 'r-cut3-la', src: '/gloves/R-CUT3-LA_776x1024.jpg', name: 'R-CUT3-LA' },
  { id: 'raeconoh', src: '/gloves/RAECONOH_717x1024.jpg', name: 'RAECONOH' },
  { id: 'rbi-vex', src: '/gloves/RBI-VEX_666x1024.jpg', name: 'RBI-VEX' },
  { id: 'rbluegrip', src: '/gloves/RBLUEGRIP_701x1024.jpg', name: 'RBLUEGRIP' },
  { id: 'recodrag', src: '/gloves/RECODRAG_766x1024.jpg', name: 'RECODRAG' },
  { id: 'recorange', src: '/gloves/RECORANGE_710x1024.jpg', name: 'RECORANGE' },
  { id: 'rexg', src: '/gloves/REXG_720x1024.jpg', name: 'REXG' },
  { id: 'rfishing', src: '/gloves/RFISHING_603x1024.jpg', name: 'RFISHING' },
  { id: 'rhotpink-pu', src: '/gloves/RHOTPINK-PU(1)_814x1024.jpg', name: 'RHOTPINK-PU' },
  { id: 'rlafo', src: '/gloves/RLAFO(1)_619x1024.jpg', name: 'RLAFO' },
  { id: 'rlmy', src: '/gloves/RLMY_700x1024.jpg', name: 'RLMY' },
  { id: 'rltoper', src: '/gloves/RLTOPER_674x1024.jpg', name: 'RLTOPER' },
  { id: 'rnit-vex', src: '/gloves/RNIT-VEX_673x1024.jpg', name: 'RNIT-VEX' },
  { id: 'rnitnp', src: '/gloves/RNITNP_700x1024.jpg', name: 'RNITNP' },
  { id: 'rnitz', src: '/gloves/RNITZ_801x1024.jpg', name: 'RNITZ' },
  { id: 'rpolargjapan', src: '/gloves/RPOLARGJAPAN_611x1024.jpg', name: 'RPOLARGJAPAN' },
  { id: 'rtepo', src: '/gloves/RTEPO(1)_724x1024.jpg', name: 'RTEPO' },
  { id: 'sandoil-win', src: '/gloves/SANDOIL-WIN_651x1024.jpg', name: 'SANDOIL-WIN' },
  { id: 'vibraton', src: '/gloves/VIBRATON_695x1024.jpg', name: 'VIBRATON' },
] as const;

export type GloveId = (typeof GLOVES)[number]['id'];
