'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Particles ──
    const count = 600
    const positions  = new Float32Array(count * 3)
    const basePos    = new Float32Array(count * 3)
    const colors     = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#3B82F6'),
      new THREE.Color('#60A5FA'),
      new THREE.Color('#818CF8'),
      new THREE.Color('#93C5FD'),
    ]

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 8
      positions[i * 3] = basePos[i * 3] = x
      positions[i * 3 + 1] = basePos[i * 3 + 1] = y
      positions[i * 3 + 2] = basePos[i * 3 + 2] = z

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    // Soft glow sprite
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0,   'rgba(255,255,255,1)')
    grad.addColorStop(0.3, 'rgba(255,255,255,0.5)')
    grad.addColorStop(1,   'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: 0.065,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ── Mouse (smooth lerp) ──
    let tX = 0, tY = 0, cX = 0, cY = 0
    const onMouse = (e: MouseEvent) => {
      tX = (e.clientX / window.innerWidth  - 0.5) * 0.9
      tY = (e.clientY / window.innerHeight - 0.5) * 0.9
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ──
    let animId: number
    const clock = new THREE.Clock()
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      cX += (tX - cX) * 0.035
      cY += (tY - cY) * 0.035

      // Per-particle sine wave float
      for (let i = 0; i < count; i++) {
        const bx = basePos[i * 3]
        const by = basePos[i * 3 + 1]
        const bz = basePos[i * 3 + 2]
        posAttr.setY(i, by + Math.sin(t * 0.35 + bx * 0.5) * 0.15)
        posAttr.setZ(i, bz + Math.cos(t * 0.25 + by * 0.4) * 0.1)
      }
      posAttr.needsUpdate = true

      particles.rotation.y = t * 0.022 + cX * 0.55
      particles.rotation.x = t * 0.012 - cY * 0.55

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}
