import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { cardMap } from '../utils/cardList'
import { hoverAnimation } from '../src/animations/hovercard'

const Card = forwardRef(({
  code,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  dealt = false,
}, ref) => {
  const meshRef = useRef()
  useImperativeHandle(ref, () => meshRef.current, [])

  const frontUrl = cardMap[code]
  const backUrl = cardMap['CardBacks']
  const [frontTex, backTex] = useLoader(
    THREE.TextureLoader,
    [frontUrl, backUrl]
  )

  const materials = [
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ color: '#222' }),
    new THREE.MeshStandardMaterial({ map: frontTex }),
    new THREE.MeshStandardMaterial({ map: backTex }),
  ]

  const hoverProps = dealt ? hoverAnimation(meshRef) : {}

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      material={materials}
      castShadow
      receiveShadow
      {...hoverProps}
    >
      <boxGeometry args={[2.5, 3.5, 0.1]} />
    </mesh>
  )
})

export default Card