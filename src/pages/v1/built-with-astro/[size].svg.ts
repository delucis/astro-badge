const sizes = {
  small: 150,
  medium: 200,
  large: 300,
};

export function getStaticPaths() {
  return Object.keys(sizes).map((size) => ({ params: { size } }));
}

export function get({ params }) {
  return {
    body: `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 2703 577" width="${sizes[params.size]}">
    <linearGradient id="a" x1="1351.5" x2="1351.5" y1="577" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#c238db"/>
      <stop offset="1" stop-color="#1d5bfc"/>
    </linearGradient>
    <path fill="url(#a)" d="M2415 577H289a289 289 0 0 1 0-577h2126a289 289 0 0 1 0 577z"/>
    <path fill="#FFF" d="m1639 321 1-2h6v-22l4-1h4v-24h8v-22l1-1h6l1-1v-22l4-1h4v-22l4-1h3v-22l2-1 1-1h76l1 3v21l7 1h1v23h6l2 1v22l3 1h3v22h8v23l2 1h6v23h8v24h8v23h7l1 2v29l-1 1h-45l-2-1v-23h-7v-15h-93l-1 1v14h-4l-4 1v23h-47v-31h7l1-2v-21h7v-2l1-21zm55-10h62v-7h-8v-24h-7v-19l-1-4h-6l-1-1v-22l-1-1h-14v23l-1 1h-7l-1 1v22h-7v23l-1 1h-7v7zm665-62v6l2 2h6l1 3v4h6l1 1 1 1v14h8v78h-7l-1 2v14h-8v8h-8v7l-1 1h-14v7l-2 1h-69v-8h-15l-1-1v-7h-7l-1-1v-7h-7v-14l-2-2h-6v-78h8v-16h6l1-3v-3l2-1h5l1-4v-4h16v-8h71v8h14zm-23 47h-7v-8h-39l-1 1v6l-1 1h-4l-2 1v46h8v8h39v-8h7v-47zm-391 8v7h14l2 2v6h6l1 1 1 1v14h6v31h-6v16h-8v4l-1 4h-15v4l-1 4h-69l-1-1v-6l-1-1h-14v-7l-4-1h-4v-8h-8v-22l46-1 1 4v3h38v-23h-54v-7l-5-1h-10v-6l-2-2h-6v-15h-8v-32h7l1-4v-11h6l2-1v-7h15v-8h70l1 1v7h15l1 4v4h7l1 4v3h6l1 1v23h-47v-7l-1-1h-37l-1 1v22l1 1h54zm70-110h47v1l1 1v45h38v47h-38v63h38v47h-70l-1-1v-7h-7v-8h-8v-93l-1-1h-22v-1c-1 0 0 0 0 0v-46h22v-2l1-45zm156 204h-46v-1c-1 0 0 0 0 0V241h46l1 1v14l1 1h5l2-1v-7h7l1-2v-6h30l1 1v45l-1 1h-30v8h-8v4l-1 4h-7v91c0 1 0 0 0 0v1c0 1 0 0 0 0v1c0 1 0 0 0 0l-1 1zm-1734 0H321l-1-1V180l1-2h116l1 4v4h15l1 4v4h7l1 4v4h8v15h6l1 48h-7v15h-8v16h7l1 5v10h6v1h1v47h-7v15h-8v8h-8v8h-16v8h-1zm-85-188v62h78v-6l1-2h7v-7h6l1-1v-30h-7v-8h-8v-4l-1-4h-77zm0 94v62h78v-8h7l1-3v-4h6l2-1v-28l-1-2h-6l-1-1v-3l-1-4h-7v-4l-1-4h-77zm713 0h6l1-1v-61l1-1h38v63h8v22l1 1h6l1 2v22h7v1c1 0 0 0 0 0v22h8v-22l4-1h3l2-2v-22h7v-22l1-1h6l1-1v-61l1-1h30v63h-7v23h-7l-1 2v21l-1 1h-6v1c-1 0 0 0 0 0v22h-8v24h-55v-23l-2-1h-6v-23h-8v-23l-1-1h-6l-1 2v22h-7v23h-8v24h-55v-16h-8v-22l-1-1h-6l-1-2v-22h-8v-23h-7l-1-2v-69h32v63h8v23h6l1 1 1 1v21l3 1h4v23h8v-23h6l2-2v-22h7l1-1v-22zm466 94h-31V282l-2-2h-6v-6l-2-2h-37v4l-1 4h-7v8h-8v110h-31V178h31v79h6l1-1 1-7h6l1-1v-6l1-1h47v8h15v6l1 2h6l1 1v14h7l1 1v125zM606 241h31v157h-31l-1-1h1v-15h-7l-1 8h-7v7l-1 1h-46v-8h-16v-8h-8v-11l-1-4h-6l-1-1V242l32-1v117h6l2 2v6h38l1-4v-4h6l1-3v-4h7V245l1-4zm702 33-2-2h-22v-31h22l1-2v-45h31v46l1 1h38v1h1v30h-38l-1 1v93h38l1 1v30l-1 1h-53l-1-2v-6h-7l-1-2v-6h-7V274zm-478 0-2-2h-22v-31h23v-46l1-1h30v47h39v31h-37l-1 1-1 1 1 92h38v32h-53l-2-1v-6l-3-1h-3l-1-3v-3l-1-2h-7v-1l1-107zm-51 124h-33l1-219 1-1h30v1l1 219zm478 0h-32V242l1-1h30l1 1v156zm-580 0V241h30l1 2v153l-1 2h-30zm548-220h32v32h-32v-32zm-548 32v-32h30l2 1v30l-2 1h-30z"/>
  </svg>`
  };
}
