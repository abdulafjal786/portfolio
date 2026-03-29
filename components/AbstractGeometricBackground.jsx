'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function AbstractGeometricBackground() {
  const canvasRef = useRef(null)
  
  // Create nodes with random positions
  const nodes = useMemo(() => {
    const nodeList = []
    const nodeCount = 65
    
    for (let i = 0; i < nodeCount; i++) {
      nodeList.push({
        // eslint-disable-next-line react-hooks/purity
        x: Math.random(),
        // eslint-disable-next-line react-hooks/purity
        y: Math.random(),
        // eslint-disable-next-line react-hooks/purity
        vx: (Math.random() - 0.5) * 0.002,
        // eslint-disable-next-line react-hooks/purity
        vy: (Math.random() - 0.5) * 0.002,
        // eslint-disable-next-line react-hooks/purity
        size: 2 + Math.random() * 4,
        // eslint-disable-next-line react-hooks/purity
        color: `hsl(${200 + Math.random() * 100}, 70%, 60%)`,
        // eslint-disable-next-line react-hooks/purity
        pulseSpeed: 0.5 + Math.random() * 1,
        // eslint-disable-next-line react-hooks/purity
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      })
    }
    return nodeList
  }, [])
  
  // Create geometric polygons
  const polygons = useMemo(() => {
    const polygonList = []
    const polygonCount = 12
    const colors = [
      'rgba(6, 182, 212, 0.15)',
      'rgba(59, 130, 246, 0.15)',
      'rgba(139, 92, 246, 0.15)',
      'rgba(168, 85, 247, 0.15)',
      'rgba(20, 184, 166, 0.15)',
      'rgba(99, 102, 241, 0.15)',
      'rgba(14, 165, 233, 0.15)',
    ]
    
    for (let i = 0; i < polygonCount; i++) {
        // eslint-disable-next-line react-hooks/purity
      const sides = 3 + Math.floor(Math.random() * 4) // Triangle, square, pentagon, hexagon
      // eslint-disable-next-line react-hooks/purity
      const centerX = Math.random()
      // eslint-disable-next-line react-hooks/purity
      const centerY = Math.random()
      // eslint-disable-next-line react-hooks/purity
      const radius = 0.08 + Math.random() * 0.12
      // eslint-disable-next-line react-hooks/purity
      const rotation = Math.random() * Math.PI * 2
      
      const vertices = []
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2 + rotation
        vertices.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        })
      }
      
      polygonList.push({
        vertices,
        sides,
        centerX,
        centerY,
        radius,
        rotation,
        // eslint-disable-next-line react-hooks/purity
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        color: colors[i % colors.length],
        strokeColor: colors[i % colors.length].replace('0.15', '0.4'),
        // eslint-disable-next-line react-hooks/purity
        scale: 0.8 + Math.random() * 0.6,
        // eslint-disable-next-line react-hooks/purity
        pulseSpeed: 0.3 + Math.random() * 0.5,
      })
    }
    return polygonList
  }, [])
  
  // Calculate connections between nodes based on distance
  const calculateConnections = (nodes, maxDistance = 0.25) => {
    const connections = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < maxDistance) {
          connections.push({
            from: i,
            to: j,
            distance,
            opacity: 1 - distance / maxDistance,
          })
        }
      }
    }
    return connections
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    // Draw a single node with glow effect
    const drawNode = (node, x, y, size, time) => {
      const pulse = 0.7 + Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.3
      const currentSize = size * pulse
      
      // Outer glow
      ctx.beginPath()
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentSize * 2)
      gradient.addColorStop(0, node.color.replace('hsl', 'hsla').replace('60%', '60%, 0.8'))
      gradient.addColorStop(1, node.color.replace('hsl', 'hsla').replace('60%', '60%, 0'))
      ctx.fillStyle = gradient
      ctx.arc(x, y, currentSize * 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Core node
      ctx.beginPath()
      ctx.fillStyle = node.color
      ctx.shadowBlur = 10
      ctx.shadowColor = node.color
      ctx.arc(x, y, currentSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner highlight
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.arc(x - currentSize * 0.2, y - currentSize * 0.2, currentSize * 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.shadowBlur = 0
    }
    
    // Draw connection lines with gradients
    const drawConnection = (fromNode, toNode, fromX, fromY, toX, toY, opacity, time) => {
      const distance = Math.hypot(fromX - toX, fromY - toY)
      const pulse = Math.sin(time * 2) * 0.1 + 0.9
      
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      
      const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY)
      gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity * 0.6 * pulse})`)
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.8 * pulse})`)
      gradient.addColorStop(1, `rgba(168, 85, 247, ${opacity * 0.6 * pulse})`)
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5 * opacity * pulse
      ctx.stroke()
      
      // Add flowing particle along the line
      const particlePos = (time * 0.5) % 1
      const particleX = fromX + (toX - fromX) * particlePos
      const particleY = fromY + (toY - fromY) * particlePos
      
      ctx.beginPath()
      const particleGradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 4)
      particleGradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`)
      particleGradient.addColorStop(1, `rgba(139, 92, 246, 0)`)
      ctx.fillStyle = particleGradient
      ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Draw polygon with animation
    const drawPolygon = (polygon, x, y, time, width, height) => {
      const pulse = 0.8 + Math.sin(time * polygon.pulseSpeed) * 0.2
      const currentScale = polygon.scale * pulse
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(time * polygon.rotationSpeed + polygon.rotation)
      ctx.scale(currentScale, currentScale)
      
      ctx.beginPath()
      ctx.moveTo(polygon.vertices[0].x * width - x + x, polygon.vertices[0].y * height - y + y)
      
      for (let i = 1; i < polygon.vertices.length; i++) {
        ctx.lineTo(polygon.vertices[i].x * width - x + x, polygon.vertices[i].y * height - y + y)
      }
      
      ctx.closePath()
      ctx.fillStyle = polygon.color
      ctx.fill()
      ctx.strokeStyle = polygon.strokeColor
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      // Draw vertices of polygon
      polygon.vertices.forEach(vertex => {
        const vx = vertex.x * width
        const vy = vertex.y * height
        
        ctx.beginPath()
        ctx.fillStyle = polygon.strokeColor.replace('0.4', '0.8')
        ctx.arc(vx, vy, 2, 0, Math.PI * 2)
        ctx.fill()
      })
      
      ctx.restore()
    }
    
    // Draw grid lines for geometric pattern
    const drawGrid = (width, height, time) => {
      const cellSize = 80
      const cols = Math.ceil(width / cellSize)
      const rows = Math.ceil(height / cellSize)
      
      ctx.save()
      ctx.globalAlpha = 0.15
      ctx.lineWidth = 1
      
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        const x = i * cellSize + Math.sin(time * 0.2 + i) * 5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        
        const gradient = ctx.createLinearGradient(x, 0, x, height)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)')
        ctx.strokeStyle = gradient
        ctx.stroke()
      }
      
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath()
        const y = i * cellSize + Math.cos(time * 0.15 + i) * 5
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        
        const gradient = ctx.createLinearGradient(0, y, width, y)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)')
        ctx.strokeStyle = gradient
        ctx.stroke()
      }
      
      ctx.restore()
    }
    
    // Draw triangular/tessellation pattern
    const drawTriangularPattern = (width, height, time) => {
      const spacing = 50
      ctx.save()
      ctx.globalAlpha = 0.1
      ctx.lineWidth = 0.8
      
      for (let x = -spacing; x < width + spacing; x += spacing) {
        for (let y = -spacing; y < height + spacing; y += spacing) {
          const offsetX = Math.sin(time * 0.3 + y * 0.02) * 8
          const offsetY = Math.cos(time * 0.25 + x * 0.02) * 8
          
          // Draw triangles
          ctx.beginPath()
          ctx.moveTo(x + offsetX, y + offsetY)
          ctx.lineTo(x + spacing/2 + offsetX + 5, y + spacing/2 + offsetY)
          ctx.lineTo(x - spacing/2 + offsetX - 5, y + spacing/2 + offsetY)
          ctx.closePath()
          
          const gradient = ctx.createLinearGradient(x, y, x + spacing, y + spacing)
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)')
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)')
          ctx.fillStyle = gradient
          ctx.fill()
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
          ctx.stroke()
          
          // Inverted triangle
          ctx.beginPath()
          ctx.moveTo(x + spacing/2 + offsetX, y + spacing/2 + offsetY)
          ctx.lineTo(x + spacing + offsetX, y + offsetY)
          ctx.lineTo(x + offsetX, y + offsetY)
          ctx.closePath()
          ctx.fillStyle = gradient
          ctx.fill()
          ctx.stroke()
        }
      }
      
      ctx.restore()
    }
    
    // Draw floating particles around nodes
    const drawFloatingParticles = (width, height, time) => {
      for (let i = 0; i < 150; i++) {
        const x = (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * width
        const y = (Math.cos(time * 0.12 + i * 0.7) * 0.5 + 0.5) * height
        const size = 1 + Math.sin(time * 2 + i) * 0.5
        
        ctx.beginPath()
        ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + Math.sin(time * 1.5 + i) * 0.05})`
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Animate nodes movement
    const animateNodes = (nodes, width, height) => {
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy
        
        // Bounce off edges with padding
        if (node.x < 0.05 || node.x > 0.95) {
          node.vx *= -1
          node.x = Math.min(Math.max(node.x, 0.05), 0.95)
        }
        if (node.y < 0.05 || node.y > 0.95) {
          node.vy *= -1
          node.y = Math.min(Math.max(node.y, 0.05), 0.95)
        }
      })
    }
    
    // Draw node labels/numbers for tech aesthetic
    const drawNodeNumbers = (node, x, y, time) => {
      const opacity = 0.3 + Math.sin(time * 2) * 0.1
      ctx.font = 'bold 10px "Courier New", monospace'
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.shadowBlur = 0
      ctx.fillText('●', x - 3, y - 8)
    }
    
    let connections = calculateConnections(nodes)
    
    const animate = () => {
      time += 0.016
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      
      // Create dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#0a0a1a')
      gradient.addColorStop(0.5, '#0f0f23')
      gradient.addColorStop(1, '#0a0a1a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Draw grid lines
      drawGrid(width, height, time)
      
      // Draw triangular tessellation pattern
      drawTriangularPattern(width, height, time)
      
      // Animate node positions
      animateNodes(nodes, width, height)
      
      // Recalculate connections
      connections = calculateConnections(nodes, 0.28)
      
      // Draw polygons (geometric shapes)
      polygons.forEach(polygon => {
        const x = polygon.centerX * width
        const y = polygon.centerY * height
        drawPolygon(polygon, x, y, time, width, height)
      })
      
      // Draw connections first (so they appear behind nodes)
      connections.forEach(conn => {
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]
        const fromX = fromNode.x * width
        const fromY = fromNode.y * height
        const toX = toNode.x * width
        const toY = toNode.y * height
        
        drawConnection(fromNode, toNode, fromX, fromY, toX, toY, conn.opacity, time)
      })
      
      // Draw all nodes
      nodes.forEach((node, idx) => {
        const x = node.x * width
        const y = node.y * height
        drawNode(node, x, y, node.size, time)
        drawNodeNumbers(node, x, y, time)
      })
      
      // Draw additional connecting lines between polygons
      ctx.save()
      ctx.globalAlpha = 0.2
      for (let i = 0; i < polygons.length - 1; i++) {
        const p1 = polygons[i]
        const p2 = polygons[i + 1]
        
        const x1 = p1.centerX * width
        const y1 = p1.centerY * height
        const x2 = p2.centerX * width
        const y2 = p2.centerY * height
        
        const distance = Math.hypot(x1 - x2, y1 - y2)
        if (distance < width * 0.3) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / (width * 0.3))})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
      ctx.restore()
      
      // Draw floating particles
      drawFloatingParticles(width, height, time)
      
      // Add subtle vignette effect
      const vignette = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5)
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, width, height)
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [nodes, polygons])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: 'block' }}
    />
  )
}