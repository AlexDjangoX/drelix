/**
 * Featured spodnie products for /products/spodnie. Images in public/spodnie.
 * PLACEHOLDER: Will be replaced by Convex data in the future.
 */
const SPODNIE_IMAGES = [
  'received_1232736257351140.webp',
  'received_1272507146683849.jpeg',
  'received_135518029358291.jpeg',
  'received_1566094533883250.jpeg',
  'received_1695453120914285.webp',
  'received_1913836465648820.jpeg',
  'received_209996428316361.jpeg',
  'received_216018057734121 (2).jpeg',
  'received_216018057734121.jpeg',
  'received_3476055422654269.jpeg',
  'received_3489013208087070.jpeg',
  'received_556027663285225.webp',
  'received_6098613203564530.webp',
  'received_6167373069990536.webp',
  'received_6277265022296957.jpeg',
  'received_742565810675531.jpeg',
  'received_746539270308309.jpeg',
  'received_786267825879975.jpeg',
  'received_912158690069227.webp',
  'received_914207479914825.jpeg',
  'received_929756271555009.jpeg',
  'received_949802652824413.webp',
  'received_949915559513760.jpeg',
  'received_963682688315182.webp',
  'received_987325712430536.jpeg',
];

export const SPODNIE = SPODNIE_IMAGES.map((file) => {
  const base = file.replace(/\.[^.]+$/, '').replace(/\s*\(\d+\)$/, '');
  return { id: base, src: `/spodnie/${file}`, name: base };
});
