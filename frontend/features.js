function whatif(){const f=footprint(S.fp).total,v=i=>+$("w"+i).value,mf={car:.17,bike:.05,bus:.05,metro:.03,walk:0}[S.fp.mode];
[1,2,3,4].forEach(i=>$("v"+i).textContent=v(i));
const sv=Math.min(f*.9,v(1)*36+S.fp.km*26*(v(2)/100)*Math.max(0,mf-.03)+v(3)*102+v(4)*4.9),pc=sv/f*100;
$("wiout").innerHTML=`<div class="kv"><span>New monthly footprint</span><b>${fmt(f-sv)} kg</b></div><div class="kv"><span>Saved per month</span><b>${fmt(sv)} kg (−${pc.toFixed(0)}%)</b></div><div class="kv"><span>≈ trees’ yearly absorption</span><b>${(sv*12/21).toFixed(0)} trees</b></div><div class="bar" style="margin-top:8px"><i style="width:${100-pc}%"></i></div><p class="mut">${pc>=20?"🎯 You’d beat the 20% reduction target!":"Reach −20% to hit the target."}</p>`}
function streak(){let n=0;const d=new Date();for(;;){const k=d.toISOString().slice(0,10),v=k===today()?savedToday():(S.log[k]||0);if(v>0)n++;else if(k!==today())break;d.setDate(d.getDate()-1)}return n}
function badges(){const ks=Object.keys(S.done).filter(k=>S.done[k]);const B=[["🌱","First action",ks.length>0],["🔥","3-day streak",streak()>=3],["⚡","Peak shifter",ks.some(k=>k.endsWith("peak"))],["☀️","Solar explorer",!!S.solared],["🏅","100 pts",pts()>=100]];
return B.map(b=>`<span class="tag" style="opacity:${b[2]?1:.4};padding:6px 10px">${b[0]} ${b[1]}</span>`).join(" ")}
let AC;function tone(f,t=0,d=.18){if(!S.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+t;o.frequency.value=f;g.gain.setValueAtTime(.12,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+d)}catch(e){}}
const chime=()=>{tone(660);tone(880,.12);tone(1320,.24,.3)};
function say(t){try{speechSynthesis.cancel();if(!S.snd)return;const u=new SpeechSynthesisUtterance(t);u.lang="en-IN";u.rate=.95;speechSynthesis.speak(u)}catch(e){}}
const TOUR=[["home","Welcome to Mission LiFE, your personal sustainability companion from the Gujarat Energy Development Agency. Let me show you around.",null],
["home","This is your footprint. We turn electricity, cooking gas, travel and food into kilograms of carbon dioxide each month, so small habits become visible numbers.","#fpcard"],
["home","Use the what-if simulator to see how fewer air-conditioner hours, metro trips, rooftop solar or LED bulbs would shrink your footprint instantly.","#wicard"],
["tasks","Daily micro-challenges earn points and carbon savings. Tick one and watch the globe behind us spin and turn greener.","#taskcard"],
["community","Join your society or neighbourhood team. Leaderboards and a shared goal turn individual effort into community impact.",null],
["solar","The Solar Hub checks rooftop feasibility for your city, with system size, savings, subsidy and payback.",null],
["admin","State administrators get anonymised district dashboards to monitor regional conservation. That is Mission LiFE: small habits, big impact.",null]];
function tour(i){const g=$("guide");document.querySelectorAll(".hl").forEach(e=>e.classList.remove("hl"));
if(i<0||i>=TOUR.length){g.classList.remove("on");try{speechSynthesis.cancel()}catch(e){}return}
const s=TOUR[i];if((location.hash||"#home").slice(1)!==s[0])location.hash=s[0];else render();
setTimeout(()=>{const e=s[2]&&document.querySelector(s[2]);if(e){e.classList.add("hl");e.scrollIntoView({behavior:"smooth",block:"center"})}},150);
g.innerHTML=`<b>Step ${i+1} of ${TOUR.length}</b><p style="margin:6px 0">${s[1]}</p><button id="gn">${i<TOUR.length-1?"Next →":"Finish"}</button> <button class="sec" id="gx">Stop</button>`;
g.classList.add("on");$("gn").onclick=()=>tour(i+1);$("gx").onclick=()=>tour(-1);chime();say(s[1])}
function upd(){$("sbtn").textContent=S.snd?"🔊 Sound on":"🔇 Sound off"}
$("gbtn").onclick=()=>{S.snd=true;save();upd();tour(0)};
$("sbtn").onclick=()=>{S.snd=!S.snd;save();upd();if(S.snd)chime();else try{speechSynthesis.cancel()}catch(e){}};upd();
