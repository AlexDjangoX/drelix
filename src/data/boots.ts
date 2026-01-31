/**
 * Featured boot products for /products/boots. Images in public/boots.
 * PLACEHOLDER: Will be replaced by Convex data in the future.
 */
const BOOTS_IMAGES = [
  'received_1192320571479064.jpeg',
  'received_1256497448292352.jpeg',
  'received_1273781143552887.jpeg',
  'received_1312545329470877.webp',
  'received_140395588959896.jpeg',
  'received_1427009798066852.jpeg',
  'received_1529938400749117.jpeg',
  'received_171226945821025.webp',
  'received_182470927963118.jpeg',
  'received_190889087063143.jpeg',
  'received_1914638798896784.jpeg',
  'received_191904903614251.jpeg',
  'received_1921771704868701.jpeg',
  'received_207759018622441.jpeg',
  'received_2607923476031410.jpeg',
  'received_502206818630074.jpeg',
  'received_522661060024998.jpeg',
  'received_525128299832576.jpeg',
  'received_526593026107119.webp',
  'received_542035641349294.jpeg',
  'received_565587442057730.jpeg',
  'received_601161841927231.jpeg',
  'received_622356566004208.jpeg',
  'received_671409254751335.jpeg',
  'received_696643665678201.webp',
  'received_772044204310047.jpeg',
  'received_898289151500675.jpeg',
  'received_910510306866585.jpeg',
  'received_914399603157716.jpeg',
];

export const BOOTS = BOOTS_IMAGES.map((file, i) => {
  const base = file.replace(/\.[^.]+$/, '').replace(/\s*\(\d+\)$/, '');
  return { id: base, src: `/boots/${file}`, name: base };
});
