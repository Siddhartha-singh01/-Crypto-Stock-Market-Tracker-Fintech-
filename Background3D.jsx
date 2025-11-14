import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background3D() {
  const mountRef = useRef(null)
  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.z = 50
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.TorusKnotGeometry(12, 3, 200, 32)
    const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--accent')), wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const particles = new THREE.BufferGeometry()
    const count = 800
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMaterial = new THREE.PointsMaterial({ color: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--primary')), size: 0.8, transparent: true, opacity: 0.6 })
    const points = new THREE.Points(particles, pMaterial)
    scene.add(points)

    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(10, 20, 30)
    scene.add(light)
    const ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambient)

    let stopped = false
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const tick = () => {
      if (stopped) return
      mesh.rotation.x += 0.003
      mesh.rotation.y += 0.004
      points.rotation.y -= 0.001
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    return () => {
      stopped = true
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      particles.dispose()
      material.dispose()
      pMaterial.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="bg3d" ref={mountRef} />
}

