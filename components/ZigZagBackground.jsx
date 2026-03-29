'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function ZigZagBackground() {
  const canvasRef = useRef(null)
  
  // Generate zigzag points
  const zigzagPoints = useMemo(() => {
    const points = []
    const numPoints = 25
    const amplitude = 40 // Height of zigzag
    const frequency = 0.15 // How often it zigzags
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints // 0 to 1
      const x = t * window.innerWidth
      
      // Create zigzag pattern using sine wave for smooth zigzag
      // But we want sharp corners, so we'll use triangle wave
      let y
      const cycle = (t * frequency * Math.PI * 2) % (Math.PI * 2)
      if (cycle < Math.PI) {
        // Ascending
        y = amplitude * (cycle / Math.PI) * 2 - amplitude
      } else {
        // Descending
        y = amplitude * (1 - (cycle - Math.PI) / Math.PI) * 2 - amplitude
      }
      
      // Add some variation for more organic look
      y += Math.sin(t * Math.PI * 4) * 5
      
      points.push({
        x,
        y: window.innerHeight / 2 + y,
        originalY: window.innerHeight / 2 + y,
        phase: i * 0.3,
        // eslint-disable-next-line react-hooks/purity
        speed: 0.5 + Math.random() * 0.5
      })
    }
    
    return points
  }, [])
  
  // Create multiple zigzag lines with different offsets
  const zigzagLines = useMemo(() => {
    const lines = []
    const numLines = 8
    const colors = [
      'rgba(6, 182, 212, 0.6)',   // cyan
      'rgba(59, 130, 246, 0.6)',   // blue
      'rgba(139, 92, 246, 0.6)',   // violet
      'rgba(168, 85, 247, 0.6)',   // purple
      'rgba(20, 184, 166, 0.6)',   // teal
      'rgba(99, 102, 241, 0.6)',   // indigo
      'rgba(14, 165, 233, 0.6)',   // sky
      'rgba(192, 132, 252, 0.6)',  // light purple
    ]
    
    for (let lineIndex = 0; lineIndex < numLines; lineIndex++) {
      const verticalOffset = (lineIndex - numLines / 2) * 50
      const points = []
      const numPoints = 30
      const amplitude = 35
      const frequency = 0.18
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints
        const x = t * window.innerWidth
        
        // Create sharp zigzag using triangle wave
        let y
        const cycle = (t * frequency * Math.PI * 2 + lineIndex * 0.5) % (Math.PI * 2)
        if (cycle < Math.PI) {
          y = amplitude * (cycle / Math.PI) * 2 - amplitude
        } else {
          y = amplitude * (1 - (cycle - Math.PI) / Math.PI) * 2 - amplitude
        }
        
        // Add slight variation based on line index
        y += Math.sin(t * Math.PI * 3 + lineIndex) * 8
        
        points.push({
          x,
          y: window.innerHeight / 2 + verticalOffset + y,
          originalY: window.innerHeight / 2 + verticalOffset + y,
          // eslint-disable-next-line react-hooks/purity
          speed: 0.3 + Math.random() * 0.4,
          phase: lineIndex * 0.8 + i * 0.2
        })
      }
      
      lines.push({
        points,
        color: colors[lineIndex % colors.length],
        strokeWidth: 1.5 + Math.sin(lineIndex) * 0.5,
        offset: lineIndex,
        // eslint-disable-next-line react-hooks/purity
        speed: 0.2 + Math.random() * 0.3
      })
    }
    
    return lines
  }, [])
  
  // Create connecting particles between zigzag points
  const connections = useMemo(() => {
    const conns = []
    const numLines = 6
    const colors = [
      'rgba(6, 182, 212, 0.4)',
      'rgba(139, 92, 246, 0.4)',
      'rgba(168, 85, 247, 0.4)',
      'rgba(20, 184, 166, 0.4)',
      'rgba(99, 102, 241, 0.4)',
      'rgba(14, 165, 233, 0.4)',
    ]
    
    for (let i = 0; i < numLines - 1; i++) {
      const points = []
      const numPoints = 40
      
      for (let j = 0; j <= numPoints; j++) {
        const t = j / numPoints
        const x = t * window.innerWidth
        
        // Create connecting zigzag between lines
        const y1 = Math.sin(t * Math.PI * 4 + i) * 30
        const y2 = Math.cos(t * Math.PI * 3 + i * 2) * 30
        const y = y1 + y2
        
        points.push({
          x,
          y: window.innerHeight / 2 + (i - numLines / 2) * 45 + y,
          phase: j * 0.15,
          // eslint-disable-next-line react-hooks/purity
          speed: 0.4 + Math.random() * 0.3
        })
      }
      
      conns.push({
        points,
        color: colors[i % colors.length],
        strokeWidth: 1,
        // eslint-disable-next-line react-hooks/purity
        speed: 0.25 + Math.random() * 0.2
      })
    }
    
    return conns
  }, [])
  
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
    
    // Draw a single zigzag line
    const drawZigzagLine = (points, color, lineWidth, timeOffset, speed) => {
      if (points.length < 2) return
      
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Animate points for wave motion
      const animatedPoints = points.map(point => ({
        x: point.x,
        y: point.originalY + Math.sin(time * speed + point.phase) * 8
      }))
      
      // Draw the line connecting points
      ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y)
      for (let i = 1; i < animatedPoints.length; i++) {
        ctx.lineTo(animatedPoints[i].x, animatedPoints[i].y)
      }
      ctx.stroke()
      
      // Draw glowing dots at each connection point
      animatedPoints.forEach((point, idx) => {
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 6)
        gradient.addColorStop(0, color.replace('0.6', '0.8'))
        gradient.addColorStop(1, color.replace('0.6', '0'))
        ctx.fillStyle = gradient
        ctx.arc(point.x, point.y, 4 + Math.sin(time * 3 + idx) * 1, 0, Math.PI * 2)
        ctx.fill()
        
        // Smaller inner dot
        ctx.beginPath()
        ctx.fillStyle = color.replace('0.6', '1')
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    
    // Draw connecting lines between points (one-to-one connections)
    const drawConnections = (points1, points2, color, lineWidth, timeOffset) => {
      if (!points2) return
      
      // Connect each point in first line to corresponding point in second line
      const minLength = Math.min(points1.length, points2.length)
      
      for (let i = 0; i < minLength; i++) {
        const point1 = points1[i]
        const point2 = points2[i]
        
        // Animate points
        const y1 = point1.originalY + Math.sin(time * point1.speed + point1.phase) * 6
        const y2 = point2.originalY + Math.sin(time * point2.speed + point2.phase) * 6
        
        ctx.beginPath()
        
        // Create gradient for the connecting line
        const gradient = ctx.createLinearGradient(point1.x, y1, point2.x, y2)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, color.replace('0.4', '0.2'))
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = lineWidth
        ctx.moveTo(point1.x, y1)
        ctx.lineTo(point2.x, y2)
        ctx.stroke()
        
        // Draw small connectors at mid points
        const midX = (point1.x + point2.x) / 2
        const midY = (y1 + y2) / 2
        
        ctx.beginPath()
        ctx.fillStyle = color.replace('0.4', '0.6')
        ctx.arc(midX, midY, 2 + Math.sin(time * 2 + i) * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Draw cross connections between non-adjacent lines for web effect
    const drawCrossConnections = (lines, time) => {
      for (let i = 0; i < lines.length - 2; i++) {
        const line1 = lines[i]
        const line2 = lines[i + 2]
        
        if (!line1 || !line2) continue
        
        const step = 3 // Connect every 3rd point
        for (let j = 0; j < Math.min(line1.points.length, line2.points.length); j += step) {
          const point1 = line1.points[j]
          const point2 = line2.points[j]
          
          const y1 = point1.originalY + Math.sin(time * point1.speed + point1.phase) * 6
          const y2 = point2.originalY + Math.sin(time * point2.speed + point2.phase) * 6
          
          // Only draw if points are within reasonable distance
          const distance = Math.abs(y2 - y1)
          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 200)})`
            ctx.lineWidth = 0.8
            ctx.moveTo(point1.x, y1)
            ctx.lineTo(point2.x, y2)
            ctx.stroke()
          }
        }
      }
    }
    
    // Draw flowing particles along the zigzag
    const drawFlowingParticles = (lines, time) => {
      lines.forEach((line, lineIdx) => {
        const points = line.points
        const numParticles = 8
        
        for (let i = 0; i < numParticles; i++) {
          const offset = (time * 0.5 + i * 0.5) % 1
          const pointIndex = Math.floor(offset * (points.length - 1))
          const t = (offset * (points.length - 1)) % 1
          
          if (pointIndex < points.length - 1) {
            const p1 = points[pointIndex]
            const p2 = points[pointIndex + 1]
            
            const y1 = p1.originalY + Math.sin(time * p1.speed + p1.phase) * 6
            const y2 = p2.originalY + Math.sin(time * p2.speed + p2.phase) * 6
            
            const x = p1.x + (p2.x - p1.x) * t
            const y = y1 + (y2 - y1) * t
            
            ctx.beginPath()
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
            gradient.addColorStop(0, line.color.replace('0.6', '1'))
            gradient.addColorStop(1, line.color.replace('0.6', '0'))
            ctx.fillStyle = gradient
            ctx.arc(x, y, 3 + Math.sin(time * 5 + i) * 1, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })
    }
    
    const animate = () => {
      time += 0.016 // Approximately 60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#0a0a1a')
      gradient.addColorStop(1, '#0f0f23')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw all zigzag lines
      zigzagLines.forEach((line, idx) => {
        drawZigzagLine(line.points, line.color, line.strokeWidth, idx, line.speed)
      })
      
      // Draw one-to-one connections between adjacent lines
      for (let i = 0; i < zigzagLines.length - 1; i++) {
        const line1 = zigzagLines[i]
        const line2 = zigzagLines[i + 1]
        const color = `rgba(168, 85, 247, 0.3)`
        
        // Connect each point one-to-one
        const minPoints = Math.min(line1.points.length, line2.points.length)
        for (let j = 0; j < minPoints; j++) {
          const p1 = line1.points[j]
          const p2 = line2.points[j]
          
          const y1 = p1.originalY + Math.sin(time * p1.speed + p1.phase) * 6
          const y2 = p2.originalY + Math.sin(time * p2.speed + p2.phase) * 6
          
          ctx.beginPath()
          const opacity = 0.25 + Math.sin(time * 1.5 + j * 0.2) * 0.1
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
          ctx.lineWidth = 1
          ctx.moveTo(p1.x, y1)
          ctx.lineTo(p2.x, y2)
          ctx.stroke()
        }
      }
      
      // Draw cross connections for more complex web
      drawCrossConnections(zigzagLines, time)
      
      // Draw flowing particles along the paths
      drawFlowingParticles(zigzagLines, time)
      
      // Add a glow effect overlay
      ctx.globalCompositeOperation = 'lighter'
      
      // Draw additional decorative elements - small floating particles
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(time * 0.2 + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(time * 0.15 + i * 0.1) * 0.5 + 0.5) * canvas.height
        
        ctx.beginPath()
        ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + Math.sin(time * 2 + i) * 0.05})`
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.globalCompositeOperation = 'source-over'
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [zigzagLines])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: 'block' }}
    />
  )
}