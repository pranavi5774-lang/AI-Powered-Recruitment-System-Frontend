import * as THREE from 'three'

const accentByColor = {
  lilac: '#9f91bd',
  blue: '#7199b6',
  mint: '#7f9c77',
  peach: '#d28a70',
  rose: '#bd7d89',
  yellow: '#c6a34f',
}

function createProfileTexture(person) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 820
  const context = canvas.getContext('2d')
  const accent = accentByColor[person.color] || '#7f9c77'

  context.fillStyle = '#fbfcf8'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = accent
  context.fillRect(0, 0, canvas.width, 150)
  context.fillStyle = 'rgba(255,255,255,.25)'
  context.beginPath()
  context.arc(534, 42, 115, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#fff'
  context.font = '700 22px DM Sans, sans-serif'
  context.fillText('CANDIDATE PROFILE', 42, 54)
  context.font = '700 52px Manrope, sans-serif'
  context.fillText(person.initials, 42, 116)

  context.fillStyle = '#2b3c32'
  context.font = '700 37px Manrope, sans-serif'
  context.fillText(person.name, 42, 222, 550)
  context.fillStyle = '#748177'
  context.font = '500 24px DM Sans, sans-serif'
  context.fillText(person.role, 42, 264, 550)

  context.strokeStyle = '#e5e9df'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(42, 305)
  context.lineTo(598, 305)
  context.stroke()

  context.fillStyle = '#929d92'
  context.font = '700 18px DM Sans, sans-serif'
  context.fillText('SKILLS FOUND', 42, 350)
  person.skills.slice(0, 3).forEach((skill, index) => {
    const y = 395 + index * 66
    context.fillStyle = '#eef3e8'
    context.beginPath()
    context.roundRect(42, y - 27, 290, 42, 10)
    context.fill()
    context.fillStyle = '#56704e'
    context.font = '600 21px DM Sans, sans-serif'
    context.fillText(skill, 60, y)
  })

  context.strokeStyle = '#e5e9df'
  context.beginPath()
  context.moveTo(42, 654)
  context.lineTo(598, 654)
  context.stroke()
  context.fillStyle = '#929d92'
  context.font = '600 18px DM Sans, sans-serif'
  context.fillText('SAMPLE SKILLS MATCH', 42, 697)
  context.fillStyle = '#365640'
  context.font = '800 54px Manrope, sans-serif'
  context.fillText(`${person.score}%`, 42, 765)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function createRoleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 820
  const context = canvas.getContext('2d')

  context.fillStyle = '#294b3b'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#d8ec9e'
  context.font = '700 22px DM Sans, sans-serif'
  context.fillText('OPEN ROLE', 44, 62)
  context.fillStyle = 'rgba(216,236,158,.15)'
  context.beginPath()
  context.arc(520, 104, 118, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#ffffff'
  context.font = '700 43px Manrope, sans-serif'
  context.fillText('Frontend', 44, 178)
  context.fillText('Developer', 44, 233)
  context.fillStyle = '#c6d6c1'
  context.font = '500 24px DM Sans, sans-serif'
  context.fillText('Engineering · Pune, Hybrid', 44, 281)

  context.strokeStyle = 'rgba(255,255,255,.2)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(44, 323)
  context.lineTo(596, 323)
  context.stroke()

  context.fillStyle = '#d8ec9e'
  context.font = '700 18px DM Sans, sans-serif'
  context.fillText('REQUIRED SKILLS', 44, 370)
  ;['React', 'JavaScript', 'CSS'].forEach((skill, index) => {
    const y = 426 + index * 66
    context.fillStyle = 'rgba(255,255,255,.12)'
    context.beginPath()
    context.roundRect(44, y - 28, 270, 42, 10)
    context.fill()
    context.fillStyle = '#f4f6ed'
    context.font = '600 21px DM Sans, sans-serif'
    context.fillText(skill, 62, y)
  })

  context.fillStyle = '#d8ec9e'
  context.font = '800 25px Manrope, sans-serif'
  context.fillText('48 applicants', 44, 699)
  context.fillStyle = '#c6d6c1'
  context.font = '500 18px DM Sans, sans-serif'
  context.fillText('TF-IDF match preview', 44, 741)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function mountMatchScene({ container, candidates, selectedId, onSelect, theme = 'light' }) {
  if (!container) return null

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch {
    container.innerHTML = '<div class="scene-fallback">This browser could not start WebGL. The ranked sample profiles below are still available.</div>'
    return { dispose() {}, select() {}, reset() {}, toggle() { return false } }
  }

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#edf1e7')
  scene.fog = new THREE.Fog('#edf1e7', 17, 36)
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80)
  const cameraHome = new THREE.Vector3(0, 6.2, 13.2)
  const lookHome = new THREE.Vector3(0, 1, 0.75)
  camera.position.copy(cameraHome)
  camera.lookAt(lookHome)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor('#edf1e7', 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.shadowMap.enabled = false
  renderer.domElement.setAttribute('aria-hidden', 'true')
  container.replaceChildren(renderer.domElement)

  scene.add(new THREE.HemisphereLight('#ffffff', '#9faa8c', 2.1))
  const keyLight = new THREE.DirectionalLight('#fff9e9', 3.1)
  keyLight.position.set(-5, 9, 8)
  scene.add(keyLight)
  const fillLight = new THREE.DirectionalLight('#d7e5c9', 1.4)
  fillLight.position.set(6, 4, -4)
  scene.add(fillLight)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 36),
    new THREE.MeshStandardMaterial({ color: '#e5ebdf', roughness: 0.96 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.42
  ground.receiveShadow = true
  scene.add(ground)

  const grid = new THREE.GridHelper(28, 28, '#bdcbb5', '#d1dacb')
  grid.position.y = -0.405
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
  gridMaterials.forEach((material) => {
    material.transparent = true
    material.opacity = 0.48
  })
  scene.add(grid)

  const rolePlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.62, 0.2, 6),
    new THREE.MeshStandardMaterial({ color: '#c7d5bf', roughness: 0.77, metalness: 0.05 }),
  )
  rolePlatform.position.set(0, -0.27, -1.1)
  rolePlatform.receiveShadow = true
  rolePlatform.castShadow = true
  scene.add(rolePlatform)

  const roleGroup = new THREE.Group()
  roleGroup.position.set(0, 1.13, -1.1)
  const roleBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.72, 0.14),
    new THREE.MeshStandardMaterial({ color: '#294b3b', roughness: 0.58, metalness: 0.04 }),
  )
  roleBody.castShadow = true
  roleBody.receiveShadow = true
  roleGroup.add(roleBody)
  const roleFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.02, 2.64),
    new THREE.MeshStandardMaterial({ map: createRoleTexture(), roughness: 0.86, metalness: 0 }),
  )
  roleFace.position.z = 0.076
  roleGroup.add(roleFace)
  const roleEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(roleBody.geometry),
    new THREE.LineBasicMaterial({ color: '#b6ce9a', transparent: true, opacity: 0.85 }),
  )
  roleGroup.add(roleEdges)
  scene.add(roleGroup)

  const positions = [
    new THREE.Vector3(-4.15, 0.99, 1.5),
    new THREE.Vector3(4.15, 0.99, 1.5),
    new THREE.Vector3(0, 0.99, 4.45),
  ]
  const cardGroups = new Map()
  const platforms = []
  const clickableMeshes = []
  const paths = []
  const packets = []

  candidates.slice(0, positions.length).forEach((person, index) => {
    const position = positions[index]
    const accent = accentByColor[person.color] || '#7f9c77'
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.34, 0.15, 6),
      new THREE.MeshStandardMaterial({ color: accent, roughness: 0.8, metalness: 0.03 }),
    )
    platform.position.set(position.x, -0.295, position.z)
    scene.add(platform)
    platforms.push(platform)

    const group = new THREE.Group()
    group.position.copy(position)
    group.userData.baseY = position.y
    group.userData.baseX = position.x
    group.userData.phase = index * 1.9

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.05, 2.62, 0.14),
      new THREE.MeshStandardMaterial({ color: '#fcfdf9', roughness: 0.74, metalness: 0.02 }),
    )
    body.castShadow = true
    body.receiveShadow = true
    body.userData.candidateId = person.id
    group.add(body)

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.98, 2.55),
      new THREE.MeshStandardMaterial({ map: createProfileTexture(person), roughness: 0.88, metalness: 0 }),
    )
    face.position.z = 0.076
    face.userData.candidateId = person.id
    group.add(face)

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry),
      new THREE.LineBasicMaterial({ color: '#d1dfbe', transparent: true, opacity: 0.85 }),
    )
    group.add(outline)
    clickableMeshes.push(body, face)
    cardGroups.set(person.id, group)
    scene.add(group)

    const start = position.clone()
    start.y = 0.34
    const end = new THREE.Vector3(index === 0 ? -0.97 : index === 1 ? 0.97 : 0, 0.38, index === 2 ? 0.42 : -0.9)
    const curve = new THREE.CatmullRomCurve3([
      start,
      new THREE.Vector3(start.x * 0.68, 1.15, start.z * 0.7),
      new THREE.Vector3(end.x * 1.25, 1.05, end.z + 0.85),
      end,
    ])
    const line = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 56, 0.014, 5, false),
      new THREE.MeshStandardMaterial({ color: accent, roughness: 0.7, emissive: accent, emissiveIntensity: 0.13 }),
    )
    scene.add(line)
    paths.push({ curve, line, basePoints: curve.points.map((point) => point.clone()), phase: index * 0.31 })

    const packet = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.12, 0.12),
      new THREE.MeshStandardMaterial({ color: '#d7ed9c', emissive: '#8cae5e', emissiveIntensity: 0.9, roughness: 0.35 }),
    )
    packet.rotation.set(0.35, 0.45, 0.2)
    scene.add(packet)
    packets.push(packet)
  })

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const pointerTarget = new THREE.Vector2()
  const timer = new THREE.Timer()
  timer.connect(document)
  const checkPixels = new URLSearchParams(window.location.search).get('pixelcheck') === '1'
  let frame = 0
  let elapsed = 0
  let playing = true
  let pixelReportReady = false
  let selected = selectedId

  function setTheme(nextTheme) {
    const dark = nextTheme === 'dark'
    const background = dark ? '#121a14' : '#edf1e7'
    scene.background.set(background)
    scene.fog.color.set(background)
    ground.material.color.set(dark ? '#1b251e' : '#e5ebdf')
    rolePlatform.material.color.set(dark ? '#304b37' : '#c7d5bf')
    gridMaterials.forEach((material, index) => material.color.set(dark ? (index === 0 ? '#425340' : '#2b382d') : (index === 0 ? '#bdcbb5' : '#d1dacb')))
  }

  setTheme(theme)

  function resize() {
    const { width, height } = container.getBoundingClientRect()
    if (!width || !height) return
    const narrowLayout = width < 650
    const layoutScale = narrowLayout ? THREE.MathUtils.clamp(width / 590, 0.58, 0.7) : 1
    camera.fov = narrowLayout ? 44 : 36
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    cardGroups.forEach((group, id) => {
      const index = candidates.findIndex((person) => person.id === id)
      group.position.x = positions[index].x * layoutScale
      platforms[index].position.x = positions[index].x * layoutScale
    })
    paths.forEach(({ curve, line, basePoints }, index) => {
      curve.points.forEach((point, pointIndex) => {
        point.x = basePoints[pointIndex].x * layoutScale
      })
      line.geometry.dispose()
      line.geometry = new THREE.TubeGeometry(curve, 56, 0.014, 5, false)
    })
    if (checkPixels) pixelReportReady = false
  }

  function chooseFromPointer(event) {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(clickableMeshes, false).find((result) => result.object.userData.candidateId)
    return hit?.object.userData.candidateId
  }

  function onPointerMove(event) {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointerTarget.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    pointerTarget.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    renderer.domElement.style.cursor = chooseFromPointer(event) ? 'pointer' : 'grab'
  }

  function onClick(event) {
    const candidateId = chooseFromPointer(event)
    if (candidateId !== undefined) {
      selected = candidateId
      onSelect(candidateId)
    }
  }

  function onPointerLeave() {
    pointerTarget.set(0, 0)
  }

  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('click', onClick)
  renderer.domElement.addEventListener('pointerleave', onPointerLeave)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  function animate() {
    frame = requestAnimationFrame(animate)
    timer.update()
    const delta = Math.min(timer.getDelta(), 0.05)
    if (playing) elapsed += delta

    pointer.lerp(pointerTarget, 0.045)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraHome.x + pointer.x * 0.64, 0.035)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraHome.y + pointer.y * 0.23, 0.035)
    camera.lookAt(lookHome.x + pointer.x * 0.13, lookHome.y, lookHome.z)

    cardGroups.forEach((group, id) => {
      const isSelected = id === selected
      const targetScale = isSelected ? 1.055 : 1
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06)
      group.position.y = group.userData.baseY + (playing ? Math.sin(elapsed * 0.82 + group.userData.phase) * 0.075 : 0)
      group.rotation.y = playing ? Math.sin(elapsed * 0.42 + group.userData.phase) * 0.035 : 0
    })

    roleGroup.rotation.y = playing ? Math.sin(elapsed * 0.35) * 0.018 : 0
    paths.forEach(({ curve, phase }, index) => {
      const progress = (elapsed * 0.12 + phase) % 1
      packets[index].position.copy(curve.getPointAt(progress))
      packets[index].rotation.y += playing ? delta * 1.7 : 0
    })
    renderer.render(scene, camera)
    if (checkPixels && !pixelReportReady) {
      const gl = renderer.getContext()
      const width = renderer.domElement.width
      const height = renderer.domElement.height
      const pixels = new Uint8Array(width * height * 4)
      gl.finish()
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      const reference = [(height - 1) * width * 4, 0]
      const colorBuckets = new Set()
      let variedPixels = 0
      let sampledPixels = 0
      const stepX = Math.max(1, Math.floor(width / 140))
      const stepY = Math.max(1, Math.floor(height / 90))
      for (let y = 0; y < height; y += stepY) {
        for (let x = 0; x < width; x += stepX) {
          const index = (y * width + x) * 4
          const distance = Math.abs(pixels[index] - pixels[reference[0]]) + Math.abs(pixels[index + 1] - pixels[reference[0] + 1]) + Math.abs(pixels[index + 2] - pixels[reference[0] + 2])
          if (distance > 28) variedPixels++
          colorBuckets.add(`${pixels[index] >> 4}-${pixels[index + 1] >> 4}-${pixels[index + 2] >> 4}`)
          sampledPixels++
        }
      }
      window.matchScenePixelReport = { width, height, variedRatio: Number((variedPixels / sampledPixels).toFixed(3)), colorBuckets: colorBuckets.size, contextLost: gl.isContextLost() }
      pixelReportReady = true
    }
  }

  animate()

  return {
    select(id) { selected = Number(id) },
    setTheme,
    toggle() { playing = !playing; return playing },
    reset() {
      pointerTarget.set(0, 0)
      pointer.set(0, 0)
      camera.position.copy(cameraHome)
      camera.lookAt(lookHome)
    },
    dispose() {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      timer.dispose()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('click', onClick)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      scene.traverse((object) => {
        object.geometry?.dispose()
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => {
            material.map?.dispose()
            material.dispose()
          })
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}