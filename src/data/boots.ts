/**
 * Safety boots product images in public/boots.
 */
export const BOOTS = [
  { id: 'boot-1', src: '/boots/received_1192320571479064.jpeg', name: 'Boot 1' },
  { id: 'boot-2', src: '/boots/received_1256497448292352.jpeg', name: 'Boot 2' },
  { id: 'boot-3', src: '/boots/received_1273781143552887.jpeg', name: 'Boot 3' },
  { id: 'boot-4', src: '/boots/received_1312545329470877.webp', name: 'Boot 4' },
  { id: 'boot-5', src: '/boots/received_140395588959896.jpeg', name: 'Boot 5' },
  { id: 'boot-6', src: '/boots/received_1427009798066852.jpeg', name: 'Boot 6' },
  { id: 'boot-7', src: '/boots/received_1529938400749117.jpeg', name: 'Boot 7' },
  { id: 'boot-8', src: '/boots/received_171226945821025.webp', name: 'Boot 8' },
  { id: 'boot-9', src: '/boots/received_182470927963118.jpeg', name: 'Boot 9' },
  { id: 'boot-10', src: '/boots/received_190889087063143.jpeg', name: 'Boot 10' },
  { id: 'boot-11', src: '/boots/received_1914638798896784.jpeg', name: 'Boot 11' },
  { id: 'boot-12', src: '/boots/received_191904903614251.jpeg', name: 'Boot 12' },
  { id: 'boot-13', src: '/boots/received_1921771704868701.jpeg', name: 'Boot 13' },
  { id: 'boot-14', src: '/boots/received_207759018622441.jpeg', name: 'Boot 14' },
  { id: 'boot-15', src: '/boots/received_2607923476031410.jpeg', name: 'Boot 15' },
  { id: 'boot-16', src: '/boots/received_502206818630074.jpeg', name: 'Boot 16' },
  { id: 'boot-17', src: '/boots/received_522661060024998.jpeg', name: 'Boot 17' },
  { id: 'boot-18', src: '/boots/received_525128299832576.jpeg', name: 'Boot 18' },
  { id: 'boot-19', src: '/boots/received_526593026107119.webp', name: 'Boot 19' },
  { id: 'boot-20', src: '/boots/received_542035641349294.jpeg', name: 'Boot 20' },
  { id: 'boot-21', src: '/boots/received_565587442057730.jpeg', name: 'Boot 21' },
  { id: 'boot-22', src: '/boots/received_601161841927231.jpeg', name: 'Boot 22' },
  { id: 'boot-23', src: '/boots/received_622356566004208.jpeg', name: 'Boot 23' },
  { id: 'boot-24', src: '/boots/received_671409254751335.jpeg', name: 'Boot 24' },
  { id: 'boot-25', src: '/boots/received_696643665678201.webp', name: 'Boot 25' },
  { id: 'boot-26', src: '/boots/received_772044204310047.jpeg', name: 'Boot 26' },
  { id: 'boot-27', src: '/boots/received_898289151500675.jpeg', name: 'Boot 27' },
  { id: 'boot-28', src: '/boots/received_910510306866585.jpeg', name: 'Boot 28' },
  { id: 'boot-29', src: '/boots/received_914399603157716.jpeg', name: 'Boot 29' },
] as const;

export type BootId = (typeof BOOTS)[number]['id'];
