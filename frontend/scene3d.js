function initScene(){try{
const T=THREE,cv=$("bg"),r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
const sc=new T.Scene(),cam=new T.PerspectiveCamera(45,1,.1,100);cam.position.z=9;
sc.add(new T.AmbientLight(0xffffff,.6));const sun=new T.DirectionalLight(0xfff1c2,1.2);sun.position.set(-5,4,6);sc.add(sun);
const M=(c,e)=>new T.MeshStandardMaterial({color:c,roughness:.8,flatShading:true,emissive:e||0});
const rig=new T.Group(),world=new T.Group(),orbit=new T.Group();rig.add(world,orbit);sc.add(rig);orbit.rotation.x=.45;
const R=2.2,g=new T.IcosahedronGeometry(R,3),p=g.attributes.position,col=[],lands=[];
const isLand=(x,y,z)=>Math.sin(x*1.7+1)*Math.cos(y*2.1)+Math.sin(z*2.3+x)*.6>.1;
for(let i=0;i<p.count;i+=3){let x=0,y=0,z=0;for(let k=0;k<3;k++){x+=p.getX(i+k)/3;y+=p.getY(i+k)/3;z+=p.getZ(i+k)/3}
const L=isLand(x,y,z),c=new T.Color(L?(Math.random()<.5?0x2e9e55:0x43bf6b):0x1b6fb5);
for(let k=0;k<3;k++)col.push(c.r,c.g,c.b);if(L&&Math.random()<.09)lands.push(new T.Vector3(x,y,z).normalize())}
g.setAttribute("color",new T.Float32BufferAttribute(col,3));
world.add(new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.9})));
const atm=new T.Mesh(new T.SphereGeometry(R*1.13,32,32),new T.MeshBasicMaterial({color:0xb08a4a,transparent:true,opacity:.16,side:T.BackSide}));world.add(atm);
const rotors=[];lands.slice(0,16).forEach(n=>{const t=new T.Group();
const tw=new T.Mesh(new T.CylinderGeometry(.02,.04,.6),M(0xffffff));tw.position.y=.3;t.add(tw);
const rot=new T.Group();rot.position.set(0,.6,.05);t.add(rot);
for(let i=0;i<3;i++){const a=new T.Group(),b=new T.Mesh(new T.BoxGeometry(.05,.36,.01),M(0xf4f4f4));b.position.y=.18;a.rotation.z=i*2.094;a.add(b);rot.add(a)}
t.position.copy(n).multiplyScalar(R);t.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);world.add(t);rotors.push(rot)});
for(let i=0;i<3;i++){const arm=new T.Group(),s=new T.Group();s.position.x=3.5;arm.rotation.y=i*2.094;
s.add(new T.Mesh(new T.BoxGeometry(.18,.18,.18),M(0xcccccc)));
const pl=new T.Mesh(new T.BoxGeometry(.8,.02,.32),M(0x1f4fd8,0x0a2a8a));pl.position.x=0;s.add(pl);arm.add(s);orbit.add(arm)}
const sunM=new T.Mesh(new T.SphereGeometry(.7,24,24),new T.MeshBasicMaterial({color:0xffd45e}));sunM.position.set(-6.5,3.6,-3);
const halo=new T.Mesh(new T.SphereGeometry(1.2,24,24),new T.MeshBasicMaterial({color:0xffc83d,transparent:true,opacity:.22,blending:T.AdditiveBlending}));halo.position.copy(sunM.position);sc.add(sunM,halo);
const N=160,pp=new Float32Array(N*3);for(let i=0;i<N*3;i++)pp[i]=(Math.random()-.5)*16;
const pg=new T.BufferGeometry();pg.setAttribute("position",new T.BufferAttribute(pp,3));
sc.add(new T.Points(pg,new T.PointsMaterial({color:0xb6f27a,size:.07,transparent:true,opacity:.8})));
let boost=0;window.celebrate=()=>{boost=.3};let mx=0,my=0;addEventListener("pointermove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function size(){const w=innerWidth,h=innerHeight,wide=w>1100;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();rig.position.set(wide?3.8:0,wide?0:2.6,0);rig.scale.setScalar(wide?1:.7);if(calm)r.render(sc,cam)}
addEventListener("resize",size);size();
window.setHealth=v=>{const h=Math.min(1,v/300);atm.material.color.copy(new T.Color(0xb08a4a).lerp(new T.Color(0x7dffb0),h));atm.material.opacity=.14+.14*h;if(calm)r.render(sc,cam)};
function tick(){world.rotation.y+=.0018+boost;boost*=.95;rotors.forEach(o=>o.rotation.z-=.04);orbit.rotation.y+=.006;
const a=pg.attributes.position;for(let i=1;i<N*3;i+=3){a.array[i]+=.004;if(a.array[i]>8)a.array[i]=-8}a.needsUpdate=true;
rig.rotation.y+=((mx*.5)-rig.rotation.y)*.03;rig.rotation.x+=((my*.3+scrollY*.0003)-rig.rotation.x)*.03;
r.render(sc,cam);requestAnimationFrame(tick)}
if(!calm)tick();setHealth(pts());
}catch(e){console.warn("3D background unavailable",e)}}
