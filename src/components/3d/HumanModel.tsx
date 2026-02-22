"use client"

import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei"
import { Suspense, useState, useRef } from "react"
import { RotateCcw, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import * as THREE from "three"
import { useInjuryStore } from "@/lib/store"

function RealHumanModel() {
    const { pendingInjuries, setPendingInjuries } = useInjuryStore()
    const { scene } = useGLTF("/human_body.glb")
    const [hovered, setHovered] = useState(false)

    // Traverse the scene and enhance materials for a softer look
    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh

            // Clone the material to avoid mutating shared assets
            if (!mesh.userData.originalMaterial) {
                mesh.userData.originalMaterial = mesh.material

                // Enhance default material settings
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                    const newMat = mesh.material.clone()
                    newMat.roughness = 0.5
                    newMat.metalness = 0.2
                    mesh.material = newMat
                }
            }

            // Apply hover effect using emissive glow
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                if (hovered) {
                    // Subtle blue emissive pulse when hovered
                    mesh.material.emissive = new THREE.Color("#1e3a8a")
                    mesh.material.emissiveIntensity = 0.2
                } else {
                    mesh.material.emissive = new THREE.Color(0x000000)
                    mesh.material.emissiveIntensity = 0
                }
            }
        }
    })

    return (
        <primitive
            object={scene}
            position={[0, -3.5, 0]} // Shifted further downward as requested
            scale={2.2} // Slightly increased scale to compensate
            onPointerOver={(e: any) => {
                e.stopPropagation()
                document.body.style.cursor = 'crosshair'
                setHovered(true)
            }}
            onPointerOut={(e: any) => {
                document.body.style.cursor = 'auto'
                setHovered(false)
            }}
            onClick={(e: any) => {
                e.stopPropagation()
                const newInjury = { id: crypto.randomUUID(), position: e.point }
                setPendingInjuries([...pendingInjuries, newInjury])
            }}
        />
    )
}

useGLTF.preload("/human_body.glb")

// Animated pulsing marker for active selections
function AnimatedPin({ position, color, isPending = false, onClick }: { position: THREE.Vector3, color: string, isPending?: boolean, onClick?: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const ringRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (isPending && ringRef.current) {
            // Pulse animation logic
            const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3
            const opacity = 0.8 - Math.sin(state.clock.elapsedTime * 4) * 0.4

            ringRef.current.scale.set(scale, scale, scale)
            const material = ringRef.current.material as THREE.MeshBasicMaterial
            if (material) material.opacity = Math.max(0, opacity)
        }
    })

    return (
        <group position={position}>
            {/* Core Dot */}
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    if (onClick) {
                        e.stopPropagation()
                        onClick()
                    }
                }}
                onPointerOver={(e) => {
                    if (onClick) {
                        e.stopPropagation()
                        document.body.style.cursor = 'pointer'
                    }
                }}
                onPointerOut={(e) => {
                    if (onClick) {
                        document.body.style.cursor = 'crosshair'
                    }
                }}
            >
                <sphereGeometry args={[isPending ? 0.08 : 0.1, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Animated Outline / Pulse Ring */}
            {isPending && (
                <mesh ref={ringRef}>
                    <sphereGeometry args={[0.1, 32, 32]} />
                    <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.BackSide} />
                </mesh>
            )}
        </group>
    )
}

export function Canvas3D() {
    const { loggedInjuries, pendingInjuries, removeInjury, setPendingInjuries } = useInjuryStore()
    const controlsRef = useRef<any>(null)

    const handleResetView = () => {
        if (controlsRef.current) {
            controlsRef.current.reset()
        }
    }

    const handleZoomIn = () => {
        if (controlsRef.current) {
            const controls = controlsRef.current
            const dist = controls.object.position.distanceTo(controls.target)
            const newDist = Math.max(controls.minDistance, dist / 1.5)
            const dir = new THREE.Vector3().subVectors(controls.object.position, controls.target).normalize()
            controls.object.position.copy(controls.target).add(dir.multiplyScalar(newDist))
            controls.update()
        }
    }

    const handleZoomOut = () => {
        if (controlsRef.current) {
            const controls = controlsRef.current
            const dist = controls.object.position.distanceTo(controls.target)
            const newDist = Math.min(controls.maxDistance, dist * 1.5)
            const dir = new THREE.Vector3().subVectors(controls.object.position, controls.target).normalize()
            controls.object.position.copy(controls.target).add(dir.multiplyScalar(newDist))
            controls.update()
        }
    }

    return (
        <div className="relative flex-1 w-full bg-neutral-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner flex flex-col mt-4 transition-colors duration-300">
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-white shadow-sm border border-neutral-200 dark:border-white/10 transition-colors">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 dark:bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 dark:bg-green-500"></span>
                </span>
                Live Mapping Session
            </div>

            {/* Floating Toolbar */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 flex flex-col gap-2 rounded-full bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md p-2 border border-neutral-200 dark:border-white/10 shadow-lg transition-colors">
                <button onClick={handleResetView} className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Reset View">
                    <RefreshCw className="w-5 h-5" />
                </button>
                <div className="h-px w-full bg-neutral-200 dark:bg-white/10 my-1 transition-colors" />
                <button onClick={handleZoomIn} className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Zoom In">
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button onClick={handleZoomOut} className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Zoom Out">
                    <ZoomOut className="w-5 h-5" />
                </button>
            </div>

            {/* The 3D Canvas */}
            <div className="w-full flex-1">
                <Canvas
                    camera={{ position: [0, 1, 10], fov: 50 }}
                    gl={{ preserveDrawingBuffer: true }} // CRITICAL for HTML2Canvas PDF Export to work on WebGL elements
                >
                    <ambientLight intensity={1.2} />
                    <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} />
                    <directionalLight position={[0, 0, 5]} intensity={1} />

                    <Suspense fallback={null}>
                        <RealHumanModel />

                        {/* Render confirmed pins */}
                        {loggedInjuries.map((pin) => (
                            <AnimatedPin
                                key={pin.id}
                                position={pin.position}
                                color={pin.color}
                                onClick={() => removeInjury(pin.id)} // Click to remove logged injury
                            />
                        ))}

                        {/* Render all multiple active pending pins with pulse */}
                        {pendingInjuries.map((pending, idx) => (
                            <AnimatedPin
                                key={pending.id}
                                position={pending.position}
                                color="#fbbf24"
                                isPending={true}
                                onClick={() => {
                                    // Remove just this pending pin if clicked
                                    const updated = [...pendingInjuries]
                                    updated.splice(idx, 1)
                                    setPendingInjuries(updated)
                                }}
                            />
                        ))}

                        <Environment preset="city" />
                        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
                    </Suspense>

                    <OrbitControls
                        ref={controlsRef}
                        enablePan={true}
                        maxPolarAngle={Math.PI / 2 + 0.2}
                        minDistance={1.5}
                        maxDistance={10}
                        target={[0, 0.5, 0]} // Focus on upper body
                    />
                </Canvas>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-center bg-white/40 dark:bg-black/40 backdrop-blur-sm px-4 py-2 border-t border-neutral-200 dark:border-white/10 text-xs text-neutral-600 dark:text-neutral-300 transition-colors">
                <p>Model: Human Anatomy (Detailed) | {loggedInjuries.length} Injuries Logged</p>
                <p className="flex items-center gap-2">
                    {pendingInjuries.length > 0 && <span className="text-amber-600 dark:text-amber-400 font-semibold animate-pulse">{pendingInjuries.length} Pending Selections in Sidebar</span>}
                </p>
            </div>
        </div>
    )
}
