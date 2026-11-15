// Restrained, low-saturation color worlds. A round owns its atmosphere.
export const ATMOSPHERES=Object.freeze([
 {id:'sage',name:'Adaçayı',hue:151,saturation:20},
 {id:'petrol',name:'Petrol',hue:190,saturation:24},
 {id:'slate',name:'Gece mavisi',hue:215,saturation:22},
 {id:'plum',name:'Füme erik',hue:278,saturation:15},
 {id:'clay',name:'Sıcak taş',hue:25,saturation:20},
 {id:'olive',name:'Zeytin',hue:83,saturation:18},
 {id:'rose',name:'Gül kurusu',hue:338,saturation:16},
 {id:'dusk',name:'Alacakaranlık',hue:244,saturation:18}
]);
export const atmosphere=id=>ATMOSPHERES.find(p=>p.id===id)||ATMOSPHERES[0];
export function nextAtmosphere(previous){const choices=ATMOSPHERES.filter(p=>p.id!==previous);return choices[Math.floor(Math.random()*choices.length)].id}
export function atmosphereColor(id,light,alpha=1){const p=atmosphere(id);return 'hsla('+p.hue+','+p.saturation+'%,'+light+'%,'+alpha+')'}
