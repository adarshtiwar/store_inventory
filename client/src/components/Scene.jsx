import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";

export default function Scene({ items = [] }) {
  const bins = items.slice(0, 12);

  return (
    <div className="scene">
      <Canvas camera={{ position: [7, 5, 8], fov: 42 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={3} />
        <group>
          {[0, 1, 2].map((row) => (
            <group key={row} position={[0, row * 1.6 - 1.6, 0]}>
              {[-3, -1, 1, 3].map((x, index) => (
                <Float
                  key={index}
                  speed={1 + index * 0.1}
                  floatIntensity={0.15}
                >
                  <mesh position={[x * 0.85, 0, 0]}>
                    <boxGeometry args={[1.25, 1.15, 1.3]} />
                    <meshStandardMaterial metalness={0.5} roughness={0.28} />
                  </mesh>
                </Float>
              ))}
            </group>
          ))}
          <Text position={[0, 2.9, 0]} fontSize={0.28} color="#b8f35a">
            STORE RACKS
          </Text>
        </group>
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="scene-label">
        Drag to rotate · live rack visualization · {bins.length} highlighted
        bins
      </div>
    </div>
  );
}
