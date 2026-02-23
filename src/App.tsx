import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

// Car colors
const CAR_COLORS = [
  { name: 'White', color: '#ffffff' },
  { name: 'Black', color: '#111111' },
  { name: 'Red', color: '#ff0044' },
  { name: 'Blue', color: '#0066ff' },
  { name: 'Gold', color: '#ffd700' },
  { name: 'Green', color: '#00ff66' },
];

// Create geometric car
function createCar(color: string): { group: THREE.Group; materials: THREE.MeshStandardMaterial[] } {
  const group = new THREE.Group();
  const materials: THREE.MeshStandardMaterial[] = [];

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.9,
    roughness: 0.1,
  });
  materials.push(bodyMat);

  // Body
  const bodyGeo = new THREE.BoxGeometry(4, 0.8, 1.8);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.5;
  body.castShadow = true;
  group.add(body);

  // Cabin
  const cabinGeo = new THREE.BoxGeometry(2, 0.7, 1.6);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    metalness: 0.9,
    roughness: 0,
    transparent: true,
    opacity: 0.5,
  });
  const cabin = new THREE.Mesh(cabinGeo, glassMat);
  cabin.position.set(-0.3, 1.1, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5 });
  const positions = [[1.3, 0.35, 0.9], [1.3, 0.35, -0.9], [-1.3, 0.35, 0.9], [-1.3, 0.35, -0.9]];

  for (const pos of positions) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.castShadow = true;
    group.add(wheel);
  }

  // Headlights
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffffee, emissiveIntensity: 2 });
  const lightGeo = new THREE.BoxGeometry(0.05, 0.15, 0.3);
  const hl1 = new THREE.Mesh(lightGeo, lightMat);
  hl1.position.set(2, 0.5, 0.5);
  group.add(hl1);
  const hl2 = new THREE.Mesh(lightGeo, lightMat);
  hl2.position.set(2, 0.5, -0.5);
  group.add(hl2);

  // Taillights
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
  const tl1 = new THREE.Mesh(lightGeo, tailMat);
  tl1.position.set(-2, 0.5, 0.5);
  group.add(tl1);
  const tl2 = new THREE.Mesh(lightGeo, tailMat);
  tl2.position.set(-2, 0.5, -0.5);
  group.add(tl2);

  return { group, materials };
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    car: THREE.Group | null;
    carMaterials: THREE.MeshStandardMaterial[];
    animationId: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeColor, setActiveColor] = useState(2);

  const changeColor = (index: number) => {
    setActiveColor(index);
    if (sceneRef.current?.carMaterials) {
      const c = CAR_COLORS[index];
      for (const mat of sceneRef.current.carMaterials) {
        gsap.to(mat.color, {
          r: new THREE.Color(c.color).r,
          g: new THREE.Color(c.color).g,
          b: new THREE.Color(c.color).b,
          duration: 0.5,
        });
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 3, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.target.set(0, 0.5, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    sceneRef.current = { scene, car: null, carMaterials: [], animationId: 0 };

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    scene.add(new THREE.DirectionalLight(0x4488ff, 0.5).translateX(-5));
    scene.add(new THREE.DirectionalLight(0xff8844, 1).translateZ(-10));

    const spot1 = new THREE.SpotLight(0xffffff, 80);
    spot1.position.set(5, 10, 0);
    spot1.angle = Math.PI / 5;
    scene.add(spot1);

    const spot2 = new THREE.SpotLight(0x4466ff, 40);
    spot2.position.set(-5, 10, 0);
    scene.add(spot2);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(25, 64),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(new THREE.GridHelper(30, 60, 0x222222, 0x111111));

    // Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.PointLight(0xffffff, 200).translateX(10));
    envScene.add(new THREE.PointLight(0x4466ff, 150).translateX(-10));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Loading
    let prog = 0;
    const loadInt = setInterval(() => {
      prog += 25;
      setLoadProgress(Math.min(prog, 100));
      if (prog >= 100) clearInterval(loadInt);
    }, 100);

    setTimeout(() => {
      const { group, materials } = createCar(CAR_COLORS[2].color);
      scene.add(group);
      if (sceneRef.current) {
        sceneRef.current.car = group;
        sceneRef.current.carMaterials = materials;
      }
      group.position.y = -2;
      gsap.to(group.position, { y: 0, duration: 1.5, ease: 'power3.out' });
      gsap.to(group.rotation, { y: 0, duration: 2, ease: 'power3.out', onComplete: () => setLoading(false) });
    }, 500);

    // Animate
    const clock = new THREE.Clock();
    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);
      controls.update();
      const t = clock.getElapsedTime();
      camera.position.y = 3 + Math.sin(t * 0.3) * 0.2;
      spot1.position.x = Math.sin(t * 0.2) * 6;
      spot2.position.x = Math.cos(t * 0.2) * 6;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (sceneRef.current) cancelAnimationFrame(sceneRef.current.animationId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="app">
      <div className={`loading-screen ${!loading ? 'hidden' : ''}`}>
        <div className="loading-logo">GEMINI</div>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${loadProgress}%` }} />
        </div>
        <div className="loading-text">Loading...</div>
      </div>

      <div ref={containerRef} />

      {!loading && (
        <div className="ui-overlay">
          <div className="cinematic-bar top" />
          <div className="cinematic-bar bottom" />
          <div className="header">
            <div className="logo">GEMINI</div>
          </div>
          <div className="car-title">
            <h1>Style View</h1>
            <h2>CONCEPT</h2>
          </div>
          <div className="interaction-hint">
            <div className="hint-circle">+</div>
            <div className="hint-text">Drag to Rotate</div>
          </div>
          <div className="color-selector">
            {CAR_COLORS.map((c, i) => (
              <button
                key={c.name}
                className={`color-btn ${activeColor === i ? 'active' : ''}`}
                style={{ background: c.color }}
                onClick={() => changeColor(i)}
              />
            ))}
          </div>
          <div className="data-overlay">
            <div className="data-line">RENDER: WebGL</div>
          </div>
        </div>
      )}
    </div>
  );
}
