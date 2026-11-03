const TABS=[["home","🏠 Home"],["tasks","✅ Daily Tasks"],["community","🏆 Community"],["solar","☀️ Solar Hub"],["admin","📊 Admin View"]];
const TASKS=[
["peak","Run washing machine / geyser outside 6–10 pm peak",.8,20],
["ac","Set AC to 24–26 °C today",1.2,30],
["standby","Switch off standby devices at the plug",.4,10],
["transit","Walk, cycle or use public transport for one trip",2,40],
["dry","Air-dry clothes instead of using a dryer",1.5,25],
["led","Replace one bulb with a 5-star LED",.3,15]];
const CITIES={Ahmedabad:1500,Gandhinagar:1500,Surat:1450,Vadodara:1480,Rajkot:1550,Bhuj:1600};
const TEAMS=[["Surat – Adajan Society",5400],["Ahmedabad – Satellite Group",4900],["Vadodara – Alkapuri RWA",4300],["Rajkot – Yagnik Road",3600],["Gandhinagar – Sector 21",3100]];
const DISTRICTS=[["Ahmedabad",4820,31200],["Surat",4110,27800],["Vadodara",2960,19400],["Rajkot",2340,15100],["Kutch",1210,9800],["Gandhinagar",1760,11300]];
let S={fp:null,done:{},log:{},ts:0};
try{const x=localStorage.getItem("mlife");if(x)S=JSON.parse(x)}catch(e){}
const save=()=>{try{localStorage.setItem("mlife",JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
const pts=()=>TASKS.reduce((a,t)=>a+(S.done[today()+t[0]]?t[3]:0),0)+(S.ts||0);
const fmt=n=>Math.round(n).toLocaleString("en-IN");
function footprint(f){const m={car:.17,bike:.05,bus:.05,metro:.03,walk:0};
 const e=f.units*.82,l=f.lpg*42.6,t=f.km*26*m[f.mode],d={veg:50,mix:90,non:130}[f.diet];
 return{e,l,t,d,total:e+l+t+d}}
function savedToday(){return TASKS.reduce((a,t)=>a+(S.done[today()+t[0]]?t[2]:0),0)}
function nav(){const h=(location.hash||"#home").slice(1);$("nav").innerHTML=TABS.map(t=>`<a href="#${t[0]}" class="${t[0]==h?"on":""}">${t[1]}</a>`).join("");return h}
function render(){const h=nav();$("pts").textContent=`⭐ ${pts()+S.ts*0} pts · Lv ${1+Math.floor(pts()/100)}`;
 const v={home,tasks,community,solar,admin}[h]||home;try{window.setHealth&&setHealth(pts())}catch(e){}$("app").innerHTML=(h==="home"&&!S.fp)?onboard():v();bind(h)}
function onboard(){return`<div class="card"><h2>Welcome! Let's find your baseline</h2><p class="mut">Answer 5 quick questions to calculate your monthly household carbon footprint.</p>
<label>Monthly electricity (units / kWh)</label><input id="u" type="number" value="250" min="0">
<label>LPG cylinders per month</label><input id="l" type="number" value="1" step="0.25" min="0">
<label>Daily commute distance (km)</label><input id="k" type="number" value="12" min="0">
<label>Main mode of travel</label><select id="m"><option value="bike">Two-wheeler</option><option value="car">Car</option><option value="bus">Bus</option><option value="metro">Metro / BRTS</option><option value="walk">Walk / cycle</option></select>
<label>Diet</label><select id="d"><option value="veg">Vegetarian</option><option value="mix">Mixed</option><option value="non">Non-vegetarian</option></select>
<button id="go">Calculate my footprint</button></div>`}
function ring(p){const r=52,c=2*Math.PI*r;return`<svg viewBox="0 0 130 130" width="130" height="130"><circle cx="65" cy="65" r="${r}" fill="none" stroke="var(--g2)" stroke-width="12"/><circle cx="65" cy="65" r="${r}" fill="none" stroke="var(--g)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c*p} ${c}" transform="rotate(-90 65 65)"/><text x="65" y="70" text-anchor="middle" font-size="22" font-weight="700" fill="var(--tx)">${Math.round(p*100)}%</text></svg>`}
function chart(){const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d.toISOString().slice(0,10)});
 const v=days.map(d=>d===today()?savedToday():(S.log[d]||0)),mx=Math.max(3,...v);
 return`<svg viewBox="0 0 280 110" width="100%" role="img" aria-label="CO2 saved in last 7 days">${v.map((x,i)=>`<rect x="${i*40+8}" y="${90-x/mx*80}" width="26" height="${x/mx*80}" rx="4" fill="var(--g)"/><text x="${i*40+21}" y="104" font-size="9" text-anchor="middle" fill="var(--mut)">${days[i].slice(8)}</text>`).join("")}</svg>`}
function nudge(){const hr=new Date().getHours();
 if(hr>=18&&hr<22)return`<div class="card nudge peak"><b>⚡ Peak grid hours now (6–10 pm)</b><p class="mut">Postpone washing machine, geyser and iron. Shifting 2 kWh saves ≈1.6 kg CO₂ and eases grid load.</p></div>`;
 if(hr>=10&&hr<16)return`<div class="card nudge sun"><b>☀️ Solar-rich hours (10 am–4 pm)</b><p class="mut">Grid is greenest now. Run heavy appliances like the washing machine and water pump.</p></div>`;
 return`<div class="card nudge"><b>💡 Tip for now</b><p class="mut">Unplug chargers and switch off standby devices before bed. Saves ≈0.4 kg CO₂ per day.</p></div>`}
function home(){const f=footprint(S.fp),sv=savedToday(),tot=Object.values(S.log).reduce((a,b)=>a+b,0)+sv;const mo=f.total-tot*0;
 return nudge()+`<div class="grid"><div class="card" id="fpcard"><h2>Monthly footprint</h2><div class="big">${fmt(f.total)} kg CO₂</div><p class="mut">Your baseline. India's average household is roughly 150–200 kg/month (indicative).</p>
 <div class="stack">${[["⚡ Electricity",f.e],["🔥 LPG",f.l],["🚗 Commute",f.t],["🍽 Food",f.d]].map(x=>`<div class="kv"><span>${x[0]}</span><b>${fmt(x[1])} kg</b></div>`).join("")}</div></div>
 <div class="card"><h2>Today's progress</h2><div style="display:flex;gap:14px;align-items:center">${ring(sv/6.2)}<div><b>${sv.toFixed(1)} kg</b> CO₂ saved today<p class="mut">Lifetime saved: ${tot.toFixed(1)} kg ≈ ${(tot/.82).toFixed(1)} kWh equivalent</p></div></div></div></div>
 <div class="card"><h2>Last 7 days: CO₂ saved (kg)</h2>${chart()}</div>
 <div class="grid"><div class="card"><h2>🔥 ${streak()}-day streak</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${badges()}</div></div>
 <div class="card"><h2>You vs reference</h2>${[["You",f.total],["Reference household (indicative)",200],["Your −20% target",f.total*.8]].map(x=>`<div class="mut">${x[0]} · ${fmt(x[1])} kg</div><div class="bar" style="margin-bottom:8px"><i style="width:${Math.min(100,x[1]/Math.max(f.total,200)*100)}%"></i></div>`).join("")}</div></div>
 <div class="card" id="wicard"><h2>🔮 What-if simulator</h2><p class="mut">Drag the sliders and watch your footprint change instantly.</p>
<label>Use AC <b id="v1">0</b> fewer hours per day</label><input class="wi" id="w1" type="range" min="0" max="6" step="0.5" value="0">
<label>Shift <b id="v2">0</b>% of trips to metro / BRTS</label><input class="wi" id="w2" type="range" min="0" max="100" step="10" value="0">
<label>Install rooftop solar: <b id="v3">0</b> kW</label><input class="wi" id="w3" type="range" min="0" max="5" step="0.5" value="0">
<label>Replace <b id="v4">0</b> bulbs with LED</label><input class="wi" id="w4" type="range" min="0" max="20" value="0">
<div id="wiout" style="margin-top:12px"></div></div><button class="sec" id="redo">Recalculate baseline</button>`}
function tasks(){return`<div class="card" id="taskcard"><h2>Today's micro-challenges</h2><p class="mut">Tick tasks you completed to earn points. Production version verifies through smart-meter data or photo proof.</p>
${TASKS.map(t=>`<label class="task" style="margin:0"><input type="checkbox" data-t="${t[0]}" ${S.done[today()+t[0]]?"checked":""}><span style="flex:1"><b>${t[1]}</b><span class="mut">Saves ${t[2]} kg CO₂</span></span><span class="tag">+${t[3]}</span></label>`).join("")}</div>`}
function community(){const you=pts()*5;const all=[...TEAMS,["⭐ You (individual)",you]].sort((a,b)=>b[1]-a[1]);
 const goal=50000,cur=TEAMS.reduce((a,t)=>a+t[1],0)*3+you;
 return`<div class="card"><h2>Community goal: 50 tonnes CO₂ saved in Gandhinagar–Ahmedabad belt</h2><div class="bar"><i style="width:${Math.min(100,cur/goal*100)}%"></i></div><p class="mut">${fmt(cur)} of ${fmt(goal)} kg · demo data</p></div>
<div class="card"><h2>Leaderboard (Eco-points)</h2><table>${all.map((r,i)=>`<tr class="${r[0].includes("You")?"me":""}"><td>${i+1}</td><td>${r[0]}</td><td>${fmt(r[1])}</td></tr>`).join("")}</table></div>
<div class="card"><h2>Rewards</h2><div class="stack"><div class="kv"><span>🌱 Green Starter</span><b>100 pts</b></div><div class="kv"><span>🏅 LED Champion badge</span><b>250 pts</b></div><div class="kv"><span>🎟 Partner voucher (demo)</span><b>500 pts</b></div></div></div>`}
function solar(){return`<div class="grid"><div class="card"><h2>Rooftop solar calculator</h2>
<label>City</label><select id="sc">${Object.keys(CITIES).map(c=>`<option>${c}</option>`).join("")}</select>
<label>Monthly consumption (units)</label><input id="su" type="number" value="${S.fp?S.fp.units:250}">
<label>Shadow-free roof area (m²)</label><input id="sa" type="number" value="30">
<label>Tariff (₹/unit)</label><input id="st" type="number" value="6.5" step="0.1">
<button id="calc">Check feasibility</button></div><div class="card" id="res"><h2>Your estimate</h2><p class="mut">Enter details and tap the button.</p></div></div>
<div class="card"><h2>Vendor directory (demo listings)</h2><div class="scroll"><table><tr><th>Vendor</th><th>City</th><th>Type</th></tr><tr><td>Empanelled Vendor A</td><td>Ahmedabad</td><td>Rooftop EPC</td></tr><tr><td>Empanelled Vendor B</td><td>Surat</td><td>Rooftop EPC</td></tr><tr><td>Empanelled Vendor C</td><td>Rajkot</td><td>Solar water heater</td></tr></table></div><p class="mut">To be replaced by GEDA's official empanelled-vendor registry and a Maps-based nearby search.</p></div>`}
function calcSolar(){S.solared=1;save();const y=CITIES[$("sc").value],u=+$("su").value,a=+$("sa").value,t=+$("st").value;
 const need=u*12/y,kw=Math.max(1,Math.min(Math.round(need*2)/2,Math.floor(a/10*2)/2));
 const gen=kw*y,cost=kw*60000,sub=Math.min(kw,2)*30000+(kw>2?(Math.min(kw,3)-2)*18000:0),sav=Math.min(gen,u*12)*t,pb=(cost-sub)/sav,co2=gen*.82/1000;
 $("res").innerHTML=`<h2>Your estimate</h2><div class="big">${kw} kW</div><p class="mut">Recommended system size (~10 m² per kW)</p>
 ${[["Yearly generation",fmt(gen)+" units"],["Approx. cost",`₹${fmt(cost)}`],["Subsidy (indicative)",`₹${fmt(sub)}`],["Yearly bill saving",`₹${fmt(sav)}`],["Payback",pb.toFixed(1)+" years"],["CO₂ avoided / year",co2.toFixed(1)+" tonnes"]].map(x=>`<div class="kv"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}
 <p class="mut">Indicative only. Confirm costs and subsidy on the official PM Surya Ghar portal or with GEDA.</p>`}
function admin(){const mx=Math.max(...DISTRICTS.map(d=>d[2]));
 return`<div class="card"><h2>State dashboard: regional conservation (demo data)</h2><div class="grid"><div><div class="big">${fmt(DISTRICTS.reduce((a,d)=>a+d[1],0))}</div><span class="mut">Active citizens</span></div><div><div class="big">${fmt(DISTRICTS.reduce((a,d)=>a+d[2],0)/1000)} t</div><span class="mut">CO₂ saved</span></div></div></div>
<div class="card"><h2>CO₂ saved by district (kg)</h2>${DISTRICTS.map(d=>`<div style="margin:10px 0"><div class="kv" style="border:0"><span>${d[0]} · ${fmt(d[1])} users</span><b>${fmt(d[2])}</b></div><div class="bar"><i style="width:${d[2]/mx*100}%"></i></div></div>`).join("")}</div>
<div class="card"><h2>Use for policy</h2><p class="mut">Identify low-engagement districts, track solar-lead conversions and publish ward-level campaigns, all from anonymised, aggregated data.</p></div>`}
function bind(h){
 if($("go"))$("go").onclick=()=>{S.fp={units:+$("u").value,lpg:+$("l").value,km:+$("k").value,mode:$("m").value,diet:$("d").value};S.ts+=50;save();render()};
 if($("redo"))$("redo").onclick=()=>{S.fp=null;save();render()};
 document.querySelectorAll("[data-t]").forEach(c=>c.onchange=()=>{S.done[today()+c.dataset.t]=c.checked;S.log[today()]=savedToday();save();if(c.checked){chime();window.celebrate&&celebrate()}render()});
 if($("calc"))$("calc").onclick=calcSolar;
 document.querySelectorAll(".wi").forEach(i=>i.oninput=whatif);if($("wiout"))whatif()}
