const sizes = {
  tiny: 109,
  small: 150,
  medium: 200,
  large: 300,
};

const gridStroke = { tiny: 8, small: 7, medium: 6, large: 4 };
const textStroke = { tiny: 3, small: 2, medium: 1, large: 0 };

export function getStaticPaths() {
  return Object.keys(sizes).map((size) => ({ params: { size } }));
}

export function get({ params }) {
  return {
    body: `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" enable-background="new 0 0 1200 220" viewBox="0 0 1200 220" width="${sizes[params.size]}">
  <filter id="star-blur"><feGaussianBlur stdDeviation="3"/></filter>
  <linearGradient id="a" x1="0" x2="0" y1="0" y2="250%" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="rgb(15 23 42)"/>
    <stop offset="1" stop-color="#602199"/>
  </linearGradient>
  <path fill="url(#a)" d="M1167 220H33c-18 0-33-15-33-33V33C0 15 15 0 33 0h1134c18 0 33 15 33 33v154c0 18-15 33-33 33z"/>
  <g fill="#ff9" filter="url(#star-blur)" opacity="0.3">
    <circle cx="1100" cy="40" r="9"/>
    <circle cx="92" cy="30" r="4"/>
    <circle cx="380" cy="110" r="4"/>
    <circle cx="135" cy="210" r="2"/>
    <circle cx="540" cy="135" r="2"/>
    <circle cx="860" cy="95" r="4"/>
    <circle cx="415" cy="200" r="6"/>
    <circle cx="1005" cy="5" r="6"/>
    <circle cx="1095" cy="95" r="4"/>
    <circle cx="570" cy="10" r="8"/>
    <circle cx="15" cy="70" r="8"/>
    <circle cx="695" cy="175" r="8"/>
    <circle cx="1165" cy="70" r="6"/>
    <circle cx="340" cy="160" r="8"/>
  </g>
  <g stroke="#f0abfc" stroke-width="${gridStroke[params.size]}" opacity="0.3" transform="rotate(0) scale(0.475)" transform-origin="center">
    <line x1="-100%" x2="200%" y1="-100%" y2="-100%" />
    <line x1="-100%" x2="200%" y1="0%" y2="0%" />
    <line x1="-100%" x2="200%" y1="100%" y2="100%" />
    <line x1="-100%" x2="200%" y1="200%" y2="200%" />
    <line x1="-50%" x2="-50%" y1="-150%" y2="250%" />
    <line x1="-25%" x2="-25%" y1="-150%" y2="250%" />
    <line x1="0%" x2="0%" y1="-150%" y2="250%" />
    <line x1="25%" x2="25%" y1="-150%" y2="250%" />
    <line x1="50%" x2="50%" y1="-150%" y2="250%" />
    <line x1="75%" x2="75%" y1="-150%" y2="250%" />
    <line x1="100%" x2="100%" y1="-150%" y2="250%" />
    <line x1="125%" x2="125%" y1="-150%" y2="250%" />
    <line x1="150%" x2="150%" y1="-150%" y2="250%" />
  </g>
  <path stroke="#FFF" transform="translate(0 3)" stroke-width="${textStroke[params.size]}" fill="#FFF" d="M135 104v1s20 2 20 23c0 18-13 27-36 27H78V58h40c20 0 31 9 31 26 0 16-14 20-14 20zm-17-3c13 0 22-5 22-17s-8-17-22-17H87v34h31zm-31 9v37h32c17 0 27-6 27-19 0-12-8-18-27-18H87zm98 14c0 18 11 24 24 24 16 1 24-10 24-25V87h9v68h-9v-11h-1s-6 12-25 12c-17 0-31-9-31-31V87h9v37zm84-67c4 0 6 2 6 5s-2 5-6 5-6-2-6-5 3-5 6-5zm5 98h-9V87h8v68zm32 0h-9V58h9v97zm27-60h-12v-8h12V72h8v15h26v8h-26v35c0 14 7 19 16 19 8 0 13-4 13-4v8s-5 4-14 4c-13 0-23-8-23-26V95zm131 1h-1l-19 59h-11l-21-68h9l17 60h1l19-60h11l20 60 17-60h9l-20 68h-12l-19-59zm71-39c3 0 5 2 5 5s-2 5-5 5c-4 1-6-2-6-5s2-5 6-5zm4 98h-9V87h9v68zm27-60h-12v-8h12V72h8v15h27v8h-26v35c0 14 6 19 15 19s13-4 13-4v8s-5 4-13 4c-14 0-24-8-24-26V95zm111 24c0-18-11-25-24-25-16 0-24 11-24 25v36h-8V58h8v40h1s6-12 25-12c17 0 31 9 31 31v38h-9v-36zm159 36h-23l-7-17h-46l-7 17h-23l39-97h28l39 97zm-52-75h-2l-15 41h32l-15-41zm106 27c0-3 0-8-13-8-10 0-13 3-13 7 0 11 50-2 50 29 0 15-14 22-36 22s-36-7-36-24v-2h20v2c0 7 5 9 16 9s16-3 16-7c0-14-51 1-51-29 0-14 13-21 34-21s34 7 34 22h-21zm40-5h-10V91l19-19h11v14h22v16h-22v24c0 12 6 14 14 14 6 0 10-2 10-2v16s-5 3-13 3c-20 0-31-9-31-28v-27zm111-17v22s-4-2-12-2c-13 0-20 9-20 20v30h-20V86h20v13h1s6-14 24-14h7zm49 0c23 0 39 13 39 36s-16 36-39 36-40-13-40-36 17-36 40-36zm0 17c-12 0-19 8-19 19 0 10 7 18 19 18s19-8 19-18c0-11-7-19-19-19z"/>
</svg>
`
  };
}
