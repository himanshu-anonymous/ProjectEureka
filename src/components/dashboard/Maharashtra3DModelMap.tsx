'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  DISTRICT_GEOMETRY,
  type DistrictGeometry,
  type DivisionId,
  DIVISIONS,
} from '@/data/maharashtraGeo.generated';
import {
  LOVABLE_DISTRICTS,
  findDistrictMetricData,
  getDistrictMetricNormalizedScore,
  getBandFromScore,
  METRIC_LABELS,
  METRIC_LEGENDS,
  BAND_COLORS,
  type MapThematicMetric,
  type DistrictMetricData,
} from '@/data/lovableDashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  ArrowPathIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CubeTransparentIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Maharashtra3DModelMapProps {
  onDistrictSelect?: (district: DistrictMetricData) => void;
  className?: string;
  initialDistrictId?: string;
  initialMetric?: MapThematicMetric;
  initialDivisionFilter?: string;
  onToggle2D?: () => void;
}

/**
 * Converts an SVG path string into an array of THREE.Shape objects.
 */
function svgPathToShapes(
  svgPath: string,
  scale = 0.25,
  offsetX = 400,
  offsetY = 332
): THREE.Shape[] {
  const shapes: THREE.Shape[] = [];
  let currentShape: THREE.Shape | null = null;
  const tokens =
    svgPath.match(/[a-df-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/gi) || [];
  let i = 0;
  let currentCommand = '';

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-z]$/i.test(token)) {
      currentCommand = token;
      i++;
      if (currentCommand === 'Z' || currentCommand === 'z') {
        if (currentShape) currentShape.closePath();
        currentCommand = '';
      }
      continue;
    }

    if (currentCommand === 'M' || currentCommand === 'm') {
      const x = (parseFloat(tokens[i++]) - offsetX) * scale;
      const y = -(parseFloat(tokens[i++]) - offsetY) * scale;
      currentShape = new THREE.Shape();
      currentShape.moveTo(x, y);
      shapes.push(currentShape);
      currentCommand = 'L';
    } else if (currentCommand === 'L' || currentCommand === 'l') {
      const x = (parseFloat(tokens[i++]) - offsetX) * scale;
      const y = -(parseFloat(tokens[i++]) - offsetY) * scale;
      if (currentShape) {
        currentShape.lineTo(x, y);
      }
    } else {
      i++;
    }
  }

  return shapes;
}

interface DistrictMeshBundle {
  mesh: THREE.Mesh;
  edges: THREE.LineSegments;
  beacon: THREE.Group;
  geo: DistrictGeometry;
  data: DistrictMetricData;
  topMaterial: THREE.MeshStandardMaterial;
  sideMaterial: THREE.MeshStandardMaterial;
  baseZ: number;
  currentZ: number;
  targetZ: number;
}

export const Maharashtra3DModelMap: React.FC<Maharashtra3DModelMapProps> = ({
  onDistrictSelect,
  className = '',
  initialDistrictId = 'raigad',
  initialMetric = 'performance',
  initialDivisionFilter = 'all',
  onToggle2D,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectedDistrictId, setSelectedDistrictId, setSearchDistrict, language } = useDashboardStore();

  // Thematic Metric & Filter states
  const [activeMetric, setActiveMetric] = useState<MapThematicMetric>(initialMetric);
  const [activeDivisionFilter, setActiveDivisionFilter] = useState<string>(initialDivisionFilter);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialDistrictId);
  const [hoveredDistrict, setHoveredDistrict] = useState<{
    geo: DistrictGeometry;
    data: DistrictMetricData;
    screenX: number;
    screenY: number;
  } | null>(null);

  // 3D Controls states
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const isAutoRotatingRef = useRef<boolean>(false);
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  const [heightMultiplier, setHeightMultiplier] = useState<number>(1.2);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const districtBundlesRef = useRef<Map<string, DistrictMeshBundle>>(new Map());
  const animationFrameIdRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const hoveredBundleRef = useRef<DistrictMeshBundle | null>(null);
  const selectedBundleRef = useRef<DistrictMeshBundle | null>(null);

  // Map of metric data
  const districtDataMap = useMemo(() => {
    const map = new Map<string, DistrictMetricData>();
    for (const d of LOVABLE_DISTRICTS) {
      map.set(d.id.toLowerCase(), d);
      map.set(d.name.toLowerCase(), d);
    }
    return map;
  }, []);

  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrictName) return null;
    return (
      districtDataMap.get(selectedDistrictName.toLowerCase()) ||
      findDistrictMetricData(selectedDistrictName)
    );
  }, [selectedDistrictName, districtDataMap]);

  // Two-way synchronization with global dashboard store
  useEffect(() => {
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      const match =
        districtDataMap.get(selectedDistrictId.toLowerCase()) ||
        findDistrictMetricData(selectedDistrictId);
      if (match) {
        setSelectedDistrictName(match.name);
      }
    }
  }, [selectedDistrictId, districtDataMap]);

  // Autocomplete options
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return DISTRICT_GEOMETRY.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameMr.includes(q) ||
        d.id.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  // Camera preset views
  const resetCameraView = useCallback((preset: 'iso' | 'top' | 'front' = 'iso') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    controls.target.set(0, 0, 5);

    if (preset === 'iso') {
      camera.position.set(0, -170, 160);
    } else if (preset === 'top') {
      camera.position.set(0, -5, 230);
    } else if (preset === 'front') {
      camera.position.set(0, -210, 60);
    }

    camera.lookAt(0, 0, 5);
    controls.update();
  }, []);

  // Sync selected district with store
  const handleSelectDistrict = useCallback(
    (districtName: string) => {
      setSelectedDistrictName(districtName);
      const data =
        districtDataMap.get(districtName.toLowerCase()) ||
        findDistrictMetricData(districtName);
      if (data) {
        setSelectedDistrictId(data.id);
        setSearchDistrict(data.name);
        if (onDistrictSelect) onDistrictSelect(data);
      }
    },
    [districtDataMap, onDistrictSelect, setSelectedDistrictId, setSearchDistrict]
  );

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0A0F1D');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 2000);
    camera.position.set(0, -170, 160);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 5);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Quality Antialiasing and Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera going underneath ground
    controls.minDistance = 60;
    controls.maxDistance = 450;
    controls.target.set(0, 0, 5);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
    sunLight.position.set(120, -140, 220);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 600;
    const shadowSize = 140;
    sunLight.shadow.camera.left = -shadowSize;
    sunLight.shadow.camera.right = shadowSize;
    sunLight.shadow.camera.top = shadowSize;
    sunLight.shadow.camera.bottom = -shadowSize;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Rim/Fill Light for dramatic 3D pop
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-150, 100, 100);
    scene.add(rimLight);

    // 6. Ground Pedestal / Dark Water Base Plane
    const groundGeo = new THREE.CylinderGeometry(155, 160, 4, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      roughness: 0.6,
      metalness: 0.3,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = Math.PI / 2;
    groundMesh.position.set(0, 0, -2.5);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Grid helper overlay on base
    const grid = new THREE.GridHelper(280, 28, 0x1e293b, 0x0f172a);
    grid.rotation.x = Math.PI / 2;
    grid.position.set(0, 0, -0.4);
    scene.add(grid);

    // 7. Outer Ring / Compass Border
    const ringGeo = new THREE.RingGeometry(152, 156, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0, -0.3);
    scene.add(ringMesh);

    // 8. Build 3D District Meshes
    const bundles = new Map<string, DistrictMeshBundle>();
    const maharashtraGroup = new THREE.Group();

    DISTRICT_GEOMETRY.forEach((geo) => {
      const data =
        districtDataMap.get(geo.id.toLowerCase()) ||
        districtDataMap.get(geo.name.toLowerCase()) ||
        findDistrictMetricData(geo.name) ||
        LOVABLE_DISTRICTS[0];

      const shapes = svgPathToShapes(geo.path, 0.25, 400, 332);
      if (shapes.length === 0) return;

      const score = getDistrictMetricNormalizedScore(data, 'performance');
      const baseExtrude = 4 + (score / 100) * 12 * 1.2;

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: baseExtrude,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.35,
        bevelThickness: 0.35,
      };

      const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);

      // Multi-material: Top face colored by metric, sides dark slate
      const band = getBandFromScore(score);
      const topColor = new THREE.Color(BAND_COLORS[band]);
      const sideColor = new THREE.Color(0x1a2333);

      const topMaterial = new THREE.MeshStandardMaterial({
        color: topColor,
        roughness: 0.32,
        metalness: 0.18,
      });

      const sideMaterial = new THREE.MeshStandardMaterial({
        color: sideColor,
        roughness: 0.65,
        metalness: 0.25,
      });

      const mesh = new THREE.Mesh(geometry, [topMaterial, sideMaterial]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { districtId: geo.id, districtName: geo.name };

      // Glowing border edges
      const edgesGeo = new THREE.EdgesGeometry(geometry, 25);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x0f172a,
        linewidth: 1,
        transparent: true,
        opacity: 0.85,
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      mesh.add(edges);

      // Centroid Beacon (Pin)
      const pinX = (geo.pin.x - 400) * 0.25;
      const pinY = -(geo.pin.y - 332) * 0.25;
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(pinX, pinY, baseExtrude + 1.2);

      const beaconSphereGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const beaconSphereMat = new THREE.MeshBasicMaterial({
        color: topColor,
      });
      const beaconSphere = new THREE.Mesh(beaconSphereGeo, beaconSphereMat);
      beaconGroup.add(beaconSphere);

      const beaconStemGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
      const beaconStemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beaconStem = new THREE.Mesh(beaconStemGeo, beaconStemMat);
      beaconStem.rotation.x = Math.PI / 2;
      beaconStem.position.z = -1.5;
      beaconGroup.add(beaconStem);

      beaconGroup.visible = false; // Turned on for selected / top
      mesh.add(beaconGroup);

      maharashtraGroup.add(mesh);

      const bundle: DistrictMeshBundle = {
        mesh,
        edges,
        beacon: beaconGroup,
        geo,
        data,
        topMaterial,
        sideMaterial,
        baseZ: 0,
        currentZ: 0,
        targetZ: 0,
      };

      bundles.set(geo.id.toLowerCase(), bundle);
      bundles.set(geo.name.toLowerCase(), bundle);
    });

    scene.add(maharashtraGroup);
    districtBundlesRef.current = bundles;

    // 9. Mouse Pointer Move Listener for Raycasting
    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = (e: MouseEvent) => {
      if (hoveredBundleRef.current) {
        handleSelectDistrict(hoveredBundleRef.current.geo.name);
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = newW / newH;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // 11. Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      controls.update();

      // Auto rotation
      if (isAutoRotatingRef.current) {
        maharashtraGroup.rotation.z += 0.003;
      }

      // Raycasting
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const meshes = Array.from(bundles.values()).map((b) => b.mesh);
      const intersects = raycasterRef.current.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const dId = (hitMesh.userData.districtId || '').toLowerCase();
        const hitBundle = bundles.get(dId);

        if (hitBundle && hitBundle !== hoveredBundleRef.current) {
          // Reset previous
          if (hoveredBundleRef.current && hoveredBundleRef.current !== selectedBundleRef.current) {
            hoveredBundleRef.current.targetZ = 0;
            hoveredBundleRef.current.topMaterial.emissive.setHex(0x000000);
          }

          hoveredBundleRef.current = hitBundle;
          hitBundle.targetZ = 3.5; // Elevate hovered district
          hitBundle.topMaterial.emissive.setHex(0x223355);

          // Update HTML tooltip position
          const hitPoint = intersects[0].point.clone();
          hitPoint.project(camera);
          const screenX = ((hitPoint.x + 1) * width) / 2;
          const screenY = ((-hitPoint.y + 1) * height) / 2;

          setHoveredDistrict({
            geo: hitBundle.geo,
            data: hitBundle.data,
            screenX,
            screenY,
          });
        }
      } else {
        if (hoveredBundleRef.current) {
          if (hoveredBundleRef.current !== selectedBundleRef.current) {
            hoveredBundleRef.current.targetZ = 0;
            hoveredBundleRef.current.topMaterial.emissive.setHex(0x000000);
          }
          hoveredBundleRef.current = null;
          setHoveredDistrict(null);
        }
      }

      // Smooth Z-Elevation Animation for each district
      bundles.forEach((bundle) => {
        const isSelected =
          bundle.geo.name.toLowerCase() === selectedDistrictName.toLowerCase() ||
          bundle.geo.id.toLowerCase() === selectedDistrictName.toLowerCase();

        if (isSelected) {
          bundle.targetZ = 6.0; // Keep selected district prominent
          bundle.beacon.visible = true;
          bundle.topMaterial.emissive.setHex(0x1769e0);
          selectedBundleRef.current = bundle;
        } else if (bundle !== hoveredBundleRef.current) {
          bundle.targetZ = 0;
          bundle.beacon.visible = false;
          bundle.topMaterial.emissive.setHex(0x000000);
        }

        // Lerp position
        bundle.currentZ += (bundle.targetZ - bundle.currentZ) * 0.15;
        bundle.mesh.position.z = bundle.currentZ;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);

      // Dispose Three.js objects
      bundles.forEach((b) => {
        b.mesh.geometry.dispose();
        if (Array.isArray(b.mesh.material)) {
          b.mesh.material.forEach((m) => m.dispose());
        }
        b.edges.geometry.dispose();
      });

      groundGeo.dispose();
      groundMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [handleSelectDistrict, districtDataMap]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update geometry heights and materials when metric, division, or multiplier changes
  useEffect(() => {
    const bundles = districtBundlesRef.current;
    if (!bundles || bundles.size === 0) return;

    bundles.forEach((bundle) => {
      const score = getDistrictMetricNormalizedScore(bundle.data, activeMetric);
      const band = getBandFromScore(score);
      const colorHex = BAND_COLORS[band];

      // Check division filter
      const matchesDivision =
        activeDivisionFilter === 'all' || bundle.geo.division === activeDivisionFilter;

      // Update material color and opacity
      if (wireframeMode) {
        bundle.topMaterial.wireframe = true;
        bundle.sideMaterial.wireframe = true;
      } else {
        bundle.topMaterial.wireframe = false;
        bundle.sideMaterial.wireframe = false;
      }

      if (matchesDivision) {
        bundle.topMaterial.color.set(colorHex);
        bundle.topMaterial.opacity = 1.0;
        bundle.topMaterial.transparent = false;
        bundle.sideMaterial.opacity = 1.0;
        bundle.sideMaterial.transparent = false;
        bundle.edges.visible = true;
      } else {
        // Dim non-matching districts
        bundle.topMaterial.color.set(0x334155);
        bundle.topMaterial.opacity = 0.22;
        bundle.topMaterial.transparent = true;
        bundle.sideMaterial.opacity = 0.15;
        bundle.sideMaterial.transparent = true;
        bundle.edges.visible = false;
      }

      // Re-extrude with new height
      const newDepth = Math.max(
        1.5,
        (3.5 + (score / 100) * 15) * heightMultiplier
      );

      const shapes = svgPathToShapes(bundle.geo.path, 0.25, 400, 332);
      if (shapes.length > 0) {
        bundle.mesh.geometry.dispose();
        bundle.mesh.geometry = new THREE.ExtrudeGeometry(shapes, {
          depth: newDepth,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.35,
          bevelThickness: 0.35,
        });

        // Update beacon height
        const pinX = (bundle.geo.pin.x - 400) * 0.25;
        const pinY = -(bundle.geo.pin.y - 332) * 0.25;
        bundle.beacon.position.set(pinX, pinY, newDepth + 1.2);

        // Update edges
        bundle.edges.geometry.dispose();
        bundle.edges.geometry = new THREE.EdgesGeometry(bundle.mesh.geometry, 25);
      }
    });
  }, [activeMetric, activeDivisionFilter, heightMultiplier, wireframeMode]);

  return (
    <section
      aria-label="3D Maharashtra Operational GIS Command Model"
      className={`panel relative flex flex-col p-3 overflow-hidden select-none bg-slate-950 border-slate-800 text-white ${className}`}
    >
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <CubeTransparentIcon className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-100">
                {language === 'mr' ? 'महाराष्ट्र ३D मॉडेल नकाशा' : 'Maharashtra 3D Model Map'}
              </span>
              <span className="rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] px-1.5 py-0.2 border border-emerald-500/30 font-bold">
                WebGL 3D
              </span>
            </div>
          </div>
        </div>

        {/* Search Autocomplete */}
        <div className="relative w-48 sm:w-56">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'जिल्हा शोधा...' : 'Search district...'}
              className="w-full rounded-md bg-slate-900 border border-slate-700 pl-8 pr-7 py-1 text-xs text-white placeholder:text-slate-500 focus:border-primary focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-md bg-slate-900 border border-slate-700 shadow-xl overflow-hidden text-xs">
              {searchResults.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    handleSelectDistrict(d.name);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">{d.name}</span>
                  <span className="text-[10px] text-slate-400 font-serif">{d.nameMr}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2D / 3D & View Mode Switchers */}
        <div className="flex items-center gap-1">
          {onToggle2D && (
            <button
              onClick={onToggle2D}
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="Switch to 2D Vector Map"
            >
              <EyeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>2D Map</span>
            </button>
          )}

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              isAutoRotating
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle 3D Auto-Rotation"
          >
            {isAutoRotating ? <PauseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
            <span>Rotate</span>
          </button>

          <button
            onClick={() => resetCameraView('iso')}
            className="flex items-center gap-1 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            title="Reset 3D Camera View"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Thematic Metric Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1 pt-2 pb-1.5 border-b border-slate-800/80">
        {(
          [
            'performance',
            'coverage',
            'sentiment',
            'crisis',
            'events',
          ] as MapThematicMetric[]
        ).map((metric) => (
          <button
            key={metric}
            onClick={() => setActiveMetric(metric)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
              activeMetric === metric
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {METRIC_LABELS[metric]}
          </button>
        ))}

        {/* Division Filter Pills */}
        <div className="ml-auto hidden lg:flex items-center gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mr-1">
            Div:
          </span>
          {['all', 'konkan', 'pune', 'nashik', 'chhatrapati-sambhajinagar', 'amravati', 'nagpur'].map(
            (div) => (
              <button
                key={div}
                onClick={() => setActiveDivisionFilter(div)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
                  activeDivisionFilter === div
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {div === 'all'
                  ? 'All'
                  : div === 'chhatrapati-sambhajinagar'
                  ? 'Chh. Sambh.'
                  : DIVISIONS[div as DivisionId]?.name || div}
              </button>
            )
          )}
        </div>
      </div>

      {/* 3. The 3D WebGL Canvas Container */}
      <div className="relative min-h-[460px] lg:min-h-[540px] flex-1 w-full overflow-hidden rounded-lg bg-slate-950 mt-2">
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Camera Angle Presets (Top-Left of 3D Canvas) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-md border border-slate-800 shadow-lg text-[10px]">
          <span className="px-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            3D Views
          </span>
          <button
            onClick={() => resetCameraView('iso')}
            className="px-2 py-0.5 text-left rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            Isometric (45°)
          </button>
          <button
            onClick={() => resetCameraView('top')}
            className="px-2 py-0.5 text-left rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            Top-Down
          </button>
          <button
            onClick={() => resetCameraView('front')}
            className="px-2 py-0.5 text-left rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            Low Horizon
          </button>
        </div>

        {/* 3D Height Extrusion Slider (Top-Right of 3D Canvas) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 shadow-lg text-[10px]">
          <span className="text-slate-400 font-medium">3D Relief:</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={heightMultiplier}
            onChange={(e) => setHeightMultiplier(parseFloat(e.target.value))}
            className="w-16 accent-blue-500 cursor-pointer"
            title="Adjust 3D Topographical Height Multiplier"
          />
          <span className="font-mono text-blue-400 tabular-nums">{heightMultiplier}x</span>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
              wireframeMode
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Mesh
          </button>
        </div>

        {/* Hover 3D Tooltip */}
        {hoveredDistrict && (
          <div
            className="pointer-events-none absolute z-20 rounded-md bg-slate-900/95 border border-slate-700 px-2.5 py-1.5 text-xs shadow-2xl backdrop-blur-xs transform -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${Math.max(60, Math.min(hoveredDistrict.screenX, 700))}px`,
              top: `${Math.max(40, hoveredDistrict.screenY)}px`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs">{hoveredDistrict.geo.name}</span>
              <span className="text-[10px] text-amber-300 font-serif">
                {hoveredDistrict.geo.nameMr}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px] text-slate-300 mt-1 border-t border-slate-800 pt-1">
              <span>{METRIC_LABELS[activeMetric]}:</span>
              <span className="font-bold text-amber-400 tabular-nums">
                {getDistrictMetricNormalizedScore(hoveredDistrict.data, activeMetric)} / 100
              </span>
            </div>
            <div className="text-[9px] text-slate-400 flex items-center justify-between gap-2 mt-0.5">
              <span>
                Rank #{LOVABLE_DISTRICTS.findIndex((d) => d.id === hoveredDistrict.data.id) + 1 || 1}
              </span>
              <span>TAT {hoveredDistrict.data.tat}m</span>
            </div>
          </div>
        )}

        {/* Dynamic Color Scale Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-10 rounded-md bg-slate-900/90 backdrop-blur-md p-2 border border-slate-800 shadow-xl text-[10px] space-y-1">
          <div className="font-bold uppercase tracking-wider text-slate-300 text-[9px]">
            {METRIC_LABELS[activeMetric]}
          </div>
          <div className="space-y-0.5">
            {METRIC_LEGENDS[activeMetric].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-[9px] text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0 shadow-xs"
                  style={{ backgroundColor: BAND_COLORS[b.band] }}
                />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected District Telemetry Card (Bottom-Right, matching Lovable) */}
        {selectedDistrictData && (() => {
          const rank = LOVABLE_DISTRICTS.findIndex((d) => d.id === selectedDistrictData.id) + 1 || 1;
          return (
          <div className="absolute bottom-3 right-3 z-10 w-64 sm:w-72 rounded-lg bg-slate-900/95 backdrop-blur-md p-3 border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 text-slate-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-white">
                    {selectedDistrictData.name}
                  </h4>
                  <span className="text-xs text-amber-300 font-serif">
                    {selectedDistrictData.nameMr}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedDistrictData.division.toUpperCase()} Division • Rank #
                  {rank}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold font-mono text-[10px] px-1.5 py-0.5">
                  {selectedDistrictData.performance} pts
                </span>
                <button
                  onClick={() => setSelectedDistrictName('')}
                  aria-label="Close district card"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <dl className="divide-y divide-slate-800 text-xs mt-1">
              <div className="flex justify-between py-1 text-[11px]">
                <dt className="text-slate-400">Press Releases (Today)</dt>
                <dd className="font-semibold tabular-nums text-white">
                  {selectedDistrictData.pressReleases}
                </dd>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <dt className="text-slate-400">Media Placements</dt>
                <dd className="font-semibold tabular-nums text-white">
                  {selectedDistrictData.placements} ({selectedDistrictData.placementPct}%)
                </dd>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <dt className="text-slate-400">Net Sentiment</dt>
                <dd
                  className={`font-semibold tabular-nums ${
                    selectedDistrictData.sentiment >= 20
                      ? 'text-emerald-400'
                      : selectedDistrictData.sentiment >= 0
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedDistrictData.sentiment > 0
                    ? `+${selectedDistrictData.sentiment}%`
                    : `${selectedDistrictData.sentiment}%`}
                </dd>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <dt className="text-slate-400">Crisis Response TAT</dt>
                <dd
                  className={`font-semibold tabular-nums ${
                    selectedDistrictData.tat <= 60
                      ? 'text-emerald-400'
                      : selectedDistrictData.tat <= 90
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedDistrictData.tat} min
                </dd>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <dt className="text-slate-400">Field Events (Month)</dt>
                <dd className="font-semibold tabular-nums text-white">
                  {selectedDistrictData.fieldEvents}
                </dd>
              </div>
            </dl>

            <Link
              href="/districts"
              onClick={() => {
                setSelectedDistrictId(selectedDistrictData.id);
                setSearchDistrict(selectedDistrictData.name);
              }}
              className="mt-2.5 block text-center w-full rounded-md bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md transition-colors cursor-pointer"
            >
              View District Details →
            </Link>
          </div>
          );
        })()}
      </div>
    </section>
  );
};
