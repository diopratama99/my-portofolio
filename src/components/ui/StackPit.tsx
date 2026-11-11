'use client'

import { useRef } from 'react'
import { SiDocker, SiLaravel, SiLinux, SiNextdotjs, SiPython, SiReact, SiTypescript } from 'react-icons/si'
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice } from '@/lib/gsap'
import { toolbox, type Tech } from '@/data/skills'
import { Bolubi, type BolubiApi } from './Bolubi'

const ITEMS: Tech[] = [
  ...toolbox,
  { Icon: SiReact, color: '#149ECA', label: 'React' },
  { Icon: SiNextdotjs, color: '#14161c', label: 'Next.js' },
  { Icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
  { Icon: SiLaravel, color: '#FF2D20', label: 'Laravel' },
  { Icon: SiPython, color: '#3776AB', label: 'Python' },
  { Icon: SiDocker, color: '#2496ED', label: 'Docker' },
  { Icon: SiLinux, color: '#14161c', label: 'Linux' },
].map((item) => (item.label === 'GitHub' ? { ...item, color: '#14161c' } : item))

const SCALES = [1.25, 0.9, 1.1, 0.8, 1, 1.2, 0.85, 1.05]

const GRAVITY = 2400
const BOUNCE = 0.42
const SUBSTEPS = 4
const MAX_SPEED = 2600
const BOLUBI_SIZE = 96
const BOLUBI_R = 40

type Body = {
  r: number
  x: number
  y: number
  vx: number
  vy: number
  held: boolean
  /** Moved by something else (bolubi): pushes others but is never pushed */
  pinned?: boolean
  // 3D spin
  wx: number
  wy: number
  wz: number
}

/**
 * Stack logos as extruded 3D objects that drop in, tumble and pile up, and can be
 * grabbed, thrown or pushed around, with bolubi wandering underneath. Collisions are
 * solved in the screen plane; the 3D is in how each object spins and catches the light.
 */
export function StackPit() {
  const root = useRef<HTMLDivElement>(null)
  const bolubi = useRef<BolubiApi | null>(null)

  useGSAP(
    () => {
      const stage = root.current!
      const canvas = stage.querySelector('canvas')!
      const reduced = prefersReducedMotion()
      let disposed = false
      let cleanupScene: (() => void) | null = null

      const start = async () => {
        const THREE = await import('three')
        const { SVGLoader } = await import('three/examples/jsm/loaders/SVGLoader.js')
        if (disposed) return

        let W = stage.clientWidth
        let H = stage.clientHeight
        const base = () => gsap.utils.clamp(28, 54, W * 0.036)

        let renderer: InstanceType<typeof THREE.WebGLRenderer>
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        } catch {
          return // No WebGL: the section still works, just without the objects
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        const scene = new THREE.Scene()
        // A perspective camera placed so that z = 0 maps 1:1 onto stage pixels
        const camera = new THREE.PerspectiveCamera(30, W / H, 1, 5000)
        const frame = () => {
          renderer.setSize(W, H, false)
          camera.aspect = W / H
          camera.position.z = H / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
          camera.updateProjectionMatrix()
        }
        frame()

        scene.add(new THREE.AmbientLight(0xffffff, 1.5))
        const key = new THREE.DirectionalLight(0xffffff, 2.6)
        key.position.set(-300, 500, 700)
        scene.add(key)
        const rim = new THREE.DirectionalLight(0xffffff, 0.9)
        rim.position.set(500, -200, 300)
        scene.add(rim)

        const loader = new SVGLoader()
        const svgs = Array.from(stage.querySelectorAll<SVGSVGElement>('.sp-src svg'))

        const objects = ITEMS.map((item, i) => {
          const paths = Array.from(svgs[i].querySelectorAll('path'))
            .map((p) => `<path d="${p.getAttribute('d')}" fill-rule="${p.getAttribute('fill-rule') ?? 'nonzero'}"/>`)
            .join('')
          const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svgs[i].getAttribute('viewBox')}">${paths}</svg>`
          const shapes = loader.parse(markup).paths.flatMap((p) => SVGLoader.createShapes(p))
          // Thin slab with a bevel cut inward (bevelOffset), so the outline and small
          // details like the N in Next.js keep the exact shape of the real logo
          const geo = new THREE.ExtrudeGeometry(shapes, {
            depth: 1.7,
            bevelEnabled: true,
            bevelThickness: 0.16,
            bevelSize: 0.16,
            bevelOffset: -0.16,
            bevelSegments: 2,
            curveSegments: 14,
          })
          geo.center()
          // SVG y points down. A half turn flips it upright without inverting the faces,
          // which a negative scale would do and leave the front lit as if it were the back.
          geo.rotateX(Math.PI)
          geo.computeBoundingBox()
          const size = new THREE.Vector3()
          geo.boundingBox!.getSize(size)
          const unit = 1 / Math.max(size.x, size.y)
          const face = new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.42, metalness: 0.05 })
          const edge = new THREE.MeshStandardMaterial({
            color: new THREE.Color(item.color).multiplyScalar(0.62),
            roughness: 0.5,
            metalness: 0.05,
          })
          const mesh = new THREE.Mesh(geo, [face, edge]) // ExtrudeGeometry groups: caps, then sides
          scene.add(mesh)
          const body: Body = { r: 0, x: 0, y: -1000, vx: 0, vy: 0, held: false, wx: 0, wy: 0, wz: 0 }
          // Comes to rest facing the viewer, each with its own slight angle
          const rest = new THREE.Quaternion().setFromEuler(
            new THREE.Euler((Math.random() - 0.5) * 0.28, (Math.random() - 0.5) * 0.42, (Math.random() - 0.5) * 0.3),
          )
          return { body, mesh, unit, rest }
        })
        const balls = objects.map((o) => o.body)
        const bolubiBody: Body = { r: BOLUBI_R, x: BOLUBI_SIZE / 2, y: H - 39, vx: 0, vy: 0, held: false, pinned: true, wx: 0, wy: 0, wz: 0 }
        const all = [...balls, bolubiBody]

        const size = () => {
          objects.forEach((o, i) => {
            o.body.r = base() * SCALES[i % SCALES.length]
            o.mesh.scale.setScalar(o.unit * o.body.r * 1.85)
          })
        }
        size()

        let lastHit = -10
        let clock = 0

        const collide = (a: Body, b: Body) => {
          const dx = b.x - a.x
          const dy = b.y - a.y
          const min = a.r + b.r
          const distSq = dx * dx + dy * dy
          if (distSq >= min * min || distSq === 0) return
          const d = Math.sqrt(distSq)
          const nx = dx / d
          const ny = dy / d
          const ma = a.held || a.pinned ? 0 : 1 / a.r
          const mb = b.held || b.pinned ? 0 : 1 / b.r
          const total = ma + mb
          if (total === 0) return
          const push = Math.max(min - d - 0.4, 0) * 0.7
          a.x -= nx * push * (ma / total)
          a.y -= ny * push * (ma / total)
          b.x += nx * push * (mb / total)
          b.y += ny * push * (mb / total)
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
          if (rel > 0) return
          const j = (-(1 + BOUNCE) * rel) / total
          a.vx -= j * ma * nx
          a.vy -= j * ma * ny
          b.vx += j * mb * nx
          b.vy += j * mb * ny
          // A knock sets both spinning in depth
          const kick = Math.min(-rel, 900) * 0.006
          for (const s of [a, b]) {
            s.wx += (Math.random() - 0.5) * kick
            s.wy += (Math.random() - 0.5) * kick
          }
          if ((a.pinned || b.pinned) && -rel > 420 && clock - lastHit > 2.5) {
            lastHit = clock
            bolubi.current?.hop()
          }
        }

        const pointer = { x: 0, y: 0, inside: false }

        const step = (dt: number) => {
          for (const b of balls) {
            if (b.held) {
              b.vx = gsap.utils.clamp(-MAX_SPEED, MAX_SPEED, (pointer.x - b.x) * 22)
              b.vy = gsap.utils.clamp(-MAX_SPEED, MAX_SPEED, (pointer.y - b.y) * 22)
            } else {
              b.vy += GRAVITY * dt
            }
            b.x += b.vx * dt
            b.y += b.vy * dt
            // Square-cornered logos reach past their collision radius, so the walls sit further in
            const wall = b.r * 1.2
            if (b.x < wall) {
              b.x = wall
              b.vx = Math.abs(b.vx) * BOUNCE
            } else if (b.x > W - wall) {
              b.x = W - wall
              b.vx = -Math.abs(b.vx) * BOUNCE
            }
            if (b.y > H - b.r) {
              b.y = H - b.r
              if (b.vy > 200) {
                b.wx += (Math.random() - 0.5) * b.vy * 0.006
                b.wy += (Math.random() - 0.5) * b.vy * 0.006
              }
              b.vy = b.vy > 90 ? -b.vy * BOUNCE : 0
              b.vx *= 0.985
              if (Math.abs(b.vx) < 3) b.vx = 0
              b.wz = -b.vx / b.r
            }
          }
          for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) collide(all[i], all[j])
          }
        }

        const axis = new THREE.Vector3()
        const spin = new THREE.Quaternion()

        const draw = (dt: number) => {
          objects.forEach(({ body: b, mesh, rest }) => {
            mesh.position.set(b.x - W / 2, H / 2 - b.y, 0)
            const rate = Math.hypot(b.wx, b.wy, b.wz)
            if (rate > 0.001) {
              axis.set(b.wx, b.wy, b.wz).divideScalar(rate)
              spin.setFromAxisAngle(axis, rate * dt)
              mesh.quaternion.premultiply(spin)
            }
            b.wx *= 0.985
            b.wy *= 0.985
            b.wz *= 0.985
            // Slow objects settle back to face the viewer so the logos stay readable
            const speed = Math.hypot(b.vx, b.vy)
            if (speed < 220 && !b.held) {
              mesh.quaternion.slerp(rest, Math.min(1, dt * 5))
              b.wx *= 0.9
              b.wy *= 0.9
              b.wz *= 0.9
            }
          })
          renderer.render(scene, camera)
        }

        let nextWander = 0
        const walkBolubi = (dt: number) => {
          const api = bolubi.current
          if (!api) return
          clock += dt
          let target: number | null = null
          if (pointer.inside && !isTouchDevice()) target = pointer.x - BOLUBI_SIZE / 2
          else if (clock >= nextWander) {
            target = Math.random() * (W - BOLUBI_SIZE)
            nextWander = clock + 3 + Math.random() * 4
          }
          if (target !== null) api.moveTo(gsap.utils.clamp(0, W - BOLUBI_SIZE, target))
          const x = api.x() + BOLUBI_SIZE / 2
          bolubiBody.vx = dt > 0 ? (x - bolubiBody.x) / dt : 0
          bolubiBody.x = x
          bolubiBody.y = H - 39
        }

        const tick = () => {
          const frameDt = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 30)
          walkBolubi(frameDt)
          for (let i = 0; i < SUBSTEPS; i++) step(frameDt / SUBSTEPS)
          draw(frameDt)
        }

        const layOut = () => {
          let x = BOLUBI_SIZE + 12
          balls.forEach((b) => {
            x += b.r
            b.x = Math.min(x, W - b.r)
            b.y = H - b.r
            x += b.r + 8
          })
          objects.forEach((o) => o.mesh.quaternion.copy(o.rest))
          draw(0)
        }

        const onResize = () => {
          W = stage.clientWidth
          H = stage.clientHeight
          frame()
          size()
          balls.forEach((b) => {
            b.x = Math.min(b.x, W - b.r)
            b.y = Math.min(b.y, H - b.r)
          })
          if (reduced) layOut()
        }
        window.addEventListener('resize', onResize)

        let dropped = false
        let running = false
        const drop = () => {
          dropped = true
          balls.forEach((b, i) => {
            b.x = W * 0.15 + Math.random() * W * 0.7
            b.y = -b.r - 40 - i * base() * 1.8
            b.vx = (Math.random() - 0.5) * 240
            b.vy = 0
            b.wx = (Math.random() - 0.5) * 12
            b.wy = (Math.random() - 0.5) * 12
            b.wz = (Math.random() - 0.5) * 6
          })
        }

        const io = reduced
          ? null
          : new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  if (!dropped) drop()
                  if (!running) gsap.ticker.add(tick)
                  running = true
                } else {
                  if (running) gsap.ticker.remove(tick)
                  running = false
                }
              },
              { threshold: 0.3 },
            )
        if (reduced) layOut()
        else io!.observe(stage)

        const toStage = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          pointer.x = e.clientX - r.left
          pointer.y = e.clientY - r.top
          pointer.inside = pointer.y >= 0 && pointer.y <= H && pointer.x >= 0 && pointer.x <= W
        }

        let grabbed: Body | null = null
        let lastX = 0
        let lastY = 0

        const onDown = (e: PointerEvent) => {
          if ((e.target as Element).closest('.b-hit')) return
          toStage(e)
          let best: Body | null = null
          let bestD = Infinity
          for (const b of balls) {
            const d = Math.hypot(b.x - pointer.x, b.y - pointer.y)
            if (d < b.r * 1.1 && d < bestD) {
              best = b
              bestD = d
            }
          }
          if (!best) return
          e.preventDefault()
          grabbed = best
          best.held = true
          best.wx += (Math.random() - 0.5) * 6
          best.wy += (Math.random() - 0.5) * 6
          stage.style.cursor = 'grabbing'
        }

        const onMove = (e: PointerEvent) => {
          toStage(e)
          const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY)
          lastX = e.clientX
          lastY = e.clientY
          if (grabbed) return
          const over = pointer.inside && balls.some((b) => Math.hypot(b.x - pointer.x, b.y - pointer.y) < b.r)
          stage.style.cursor = over ? 'grab' : ''
          if (!pointer.inside) return
          const reach = 40
          for (const b of balls) {
            const dx = b.x - pointer.x
            const dy = b.y - pointer.y
            const d = Math.hypot(dx, dy) || 1
            if (d > b.r + reach) continue
            const f = (1 - d / (b.r + reach)) * Math.min(speed, 40) * 9
            b.vx += (dx / d) * f
            b.vy += (dy / d) * f - f * 0.35
            b.wx += (dy / d) * f * 0.012
            b.wy += (-dx / d) * f * 0.012
          }
        }

        const onUp = () => {
          if (!grabbed) return
          grabbed.held = false
          grabbed = null
          stage.style.cursor = ''
        }

        stage.addEventListener('pointerdown', onDown)
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)

        cleanupScene = () => {
          io?.disconnect()
          gsap.ticker.remove(tick)
          window.removeEventListener('resize', onResize)
          stage.removeEventListener('pointerdown', onDown)
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerup', onUp)
          window.removeEventListener('pointercancel', onUp)
          objects.forEach((o) => {
            o.mesh.geometry.dispose()
            ;(o.mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>[]).forEach((m) => m.dispose())
          })
          renderer.dispose()
        }
      }

      // Three.js only loads once the section is close, so the first page load stays light
      const loadWhenNear = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          loadWhenNear.disconnect()
          start()
        },
        { rootMargin: '600px' },
      )
      loadWhenNear.observe(stage)

      return () => {
        disposed = true
        loadWhenNear.disconnect()
        cleanupScene?.()
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="relative overflow-hidden select-none"
      style={{ height: 'clamp(16rem, 40vh, 26rem)', borderBottom: '1px solid var(--line-strong)', touchAction: 'pan-y' }}
    >
      <canvas aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {/* Source artwork: the logo outlines are read from these to build the 3D shapes */}
      <div className="sp-src" hidden>
        {ITEMS.map(({ Icon, label }) => (
          <Icon key={label} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 z-10" style={{ width: BOLUBI_SIZE }}>
        <Bolubi apiRef={bolubi} label="bolubi" />
      </div>
    </div>
  )
}
