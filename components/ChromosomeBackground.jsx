'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function ChromosomeBackground() {
  const canvasRef = useRef(null)
  
  // Create multiple DNA/chromosome strands
  const dnaStrands = useMemo(() => {
    const strands = []
    const strandCount = 6
    const colors = [
      'rgba(59, 130, 246, 0.7)',   // medical blue
      'rgba(14, 165, 233, 0.7)',   // sky blue
      'rgba(6, 182, 212, 0.7)',    // cyan
      'rgba(34, 197, 94, 0.7)',    // medical green
      'rgba(16, 185, 129, 0.7)',   // emerald
      'rgba(20, 184, 166, 0.7)',   // teal
    ]
    
    for (let i = 0; i < strandCount; i++) {
      const xOffset = (i / (strandCount - 1)) * 0.8 + 0.1
      const amplitude = 35 + Math.sin(i) * 10
      // eslint-disable-next-line react-hooks/purity
      const frequency = 0.01 + Math.random() * 0.006
      // eslint-disable-next-line react-hooks/purity
      const speed = 0.6 + Math.random() * 0.4
      
      strands.push({
        xOffset,
        amplitude,
        frequency,
        speed,
        color: colors[i % colors.length],
        lineWidth: 2,
      })
    }
    return strands
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
    
    // Draw a single DNA helix strand with sine wave
    const drawStrand = (strand, offsetY, width, height, currentTime) => {
      const points = []
      const step = 10
      const startY = -80
      const endY = height + 80
      const x = strand.xOffset * width
      const amplitude = strand.amplitude
      const frequency = strand.frequency
      const speed = strand.speed
      
      for (let yPos = startY; yPos <= endY; yPos += step) {
        const relativeY = (yPos + currentTime * speed * 50) * frequency
        const xOffset = Math.sin(relativeY) * amplitude
        const xPos = x + xOffset
        
        points.push({ x: xPos, y: yPos })
      }
      
      // Draw the strand line
      if (points.length > 1) {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        
        ctx.strokeStyle = strand.color
        ctx.lineWidth = strand.lineWidth
        ctx.stroke()
        
        // Draw glowing particles along the strand
        for (let i = 0; i < points.length; i += 4) {
          const point = points[i]
          const pulse = 0.5 + Math.sin(currentTime * 3 + i * 0.2) * 0.5
          
          ctx.beginPath()
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 6)
          gradient.addColorStop(0, strand.color.replace('0.7', '1'))
          gradient.addColorStop(1, strand.color.replace('0.7', '0'))
          ctx.fillStyle = gradient
          ctx.arc(point.x, point.y, 3 * pulse, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      return points
    }
    
    // Draw chromosome rungs (connections between strands)
    const drawRungs = (strands, width, height, currentTime) => {
      const rungCount = 40
      
      for (let i = 0; i <= rungCount; i++) {
        const y = (i / rungCount) * (height + 200) + (currentTime * 50) % (height + 200) - 100
        
        if (y >= -100 && y <= height + 100) {
          // Connect adjacent strands with rungs
          for (let s = 0; s < strands.length - 1; s++) {
            const strand1 = strands[s]
            const strand2 = strands[s + 1]
            
            const x1 = strand1.xOffset * width
            const x2 = strand2.xOffset * width
            
            // Calculate x positions with sine wave offset
            const relativeY1 = (y + currentTime * 50) * strand1.frequency
            const relativeY2 = (y + currentTime * 50) * strand2.frequency
            
            const xOffset1 = Math.sin(relativeY1) * strand1.amplitude
            const xOffset2 = Math.sin(relativeY2) * strand2.amplitude
            
            const finalX1 = x1 + xOffset1
            const finalX2 = x2 + xOffset2
            
            ctx.beginPath()
            ctx.moveTo(finalX1, y)
            ctx.lineTo(finalX2, y)
            
            const opacity = 0.4 + Math.sin(i * 0.5) * 0.2
            const gradient = ctx.createLinearGradient(finalX1, y, finalX2, y)
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity + 0.2})`)
            gradient.addColorStop(1, `rgba(14, 165, 233, ${opacity})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.stroke()
            
            // Add glowing center to rungs
            const midX = (finalX1 + finalX2) / 2
            ctx.beginPath()
            const pulse = 0.5 + Math.sin(currentTime * 4 + y) * 0.5
            const gradient2 = ctx.createRadialGradient(midX, y, 0, midX, y, 6)
            gradient2.addColorStop(0, `rgba(255, 255, 255, 0.8)`)
            gradient2.addColorStop(1, `rgba(59, 130, 246, 0)`)
            ctx.fillStyle = gradient2
            ctx.arc(midX, y, 2.5 * pulse, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }
    
    // Draw nucleotide particles
    const drawNucleotides = (strands, width, height, currentTime) => {
      strands.forEach((strand) => {
        const x = strand.xOffset * width
        const amplitude = strand.amplitude
        const frequency = strand.frequency
        const speed = strand.speed
        
        const step = 18
        const startY = -100
        const endY = height + 100
        
        for (let yPos = startY; yPos <= endY; yPos += step) {
          const relativeY = (yPos + currentTime * speed * 50) * frequency
          const xOffset = Math.sin(relativeY) * amplitude
          const xPos = x + xOffset
          
          const pulse = 0.6 + Math.sin(currentTime * 2 + yPos * 0.05) * 0.4
          const size = 3
          
          ctx.beginPath()
          const gradient = ctx.createRadialGradient(xPos - 2, yPos - 2, 0, xPos, yPos, size * pulse)
          gradient.addColorStop(0, strand.color.replace('0.7', '1'))
          gradient.addColorStop(1, strand.color.replace('0.7', '0.3'))
          ctx.fillStyle = gradient
          ctx.arc(xPos, yPos, size * pulse, 0, Math.PI * 2)
          ctx.fill()
          
          // Add inner highlight
          ctx.beginPath()
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.arc(xPos - 1, yPos - 1, size * pulse * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }
    
    // Draw medical cross symbols
    const drawMedicalSymbols = (strands, width, height, currentTime) => {
      strands.forEach((strand) => {
        const x = strand.xOffset * width
        const amplitude = strand.amplitude
        const frequency = strand.frequency
        const speed = strand.speed
        
        const step = 55
        const startY = -100 + (currentTime * speed * 50) % step
        
        for (let yPos = startY; yPos <= height + 100; yPos += step) {
          const relativeY = (yPos + currentTime * speed * 50) * frequency
          const xOffset = Math.sin(relativeY) * amplitude
          const xPos = x + xOffset
          
          const crossSize = 7
          const opacity = 0.4 + Math.sin(currentTime * 2 + yPos) * 0.2
          
          ctx.save()
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.moveTo(xPos, yPos - crossSize)
          ctx.lineTo(xPos, yPos + crossSize)
          ctx.moveTo(xPos - crossSize, yPos)
          ctx.lineTo(xPos + crossSize, yPos)
          
          ctx.strokeStyle = `rgba(255, 255, 255, 0.7)`
          ctx.lineWidth = 1.5
          ctx.stroke()
          
          // Draw circle around cross
          ctx.beginPath()
          ctx.arc(xPos, yPos, crossSize * 0.7, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(59, 130, 246, 0.4)`
          ctx.stroke()
          ctx.restore()
        }
      })
    }
    
    // Draw base pairs between outer strands
    const drawBasePairs = (strands, width, height, currentTime) => {
      if (strands.length < 2) return
      
      const leftStrand = strands[0]
      const rightStrand = strands[strands.length - 1]
      const pairCount = 35
      
      for (let i = 0; i <= pairCount; i++) {
        const y = (i / pairCount) * (height + 200) + (currentTime * 55) % (height + 200) - 100
        
        if (y >= -100 && y <= height + 100) {
          const leftRelativeY = (y + currentTime * 50) * leftStrand.frequency
          const rightRelativeY = (y + currentTime * 50) * rightStrand.frequency
          
          const leftXOffset = Math.sin(leftRelativeY) * leftStrand.amplitude
          const rightXOffset = Math.sin(rightRelativeY) * rightStrand.amplitude
          
          const leftX = leftStrand.xOffset * width + leftXOffset
          const rightX = rightStrand.xOffset * width + rightXOffset
          
          ctx.beginPath()
          ctx.moveTo(leftX, y)
          ctx.lineTo(rightX, y)
          
          const opacity = 0.3 + Math.sin(i * 0.3) * 0.1
          const gradient = ctx.createLinearGradient(leftX, y, rightX, y)
          gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`)
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity + 0.2})`)
          gradient.addColorStop(1, `rgba(14, 165, 233, ${opacity})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }
    
    // Draw floating medical particles
    const drawMedicalParticles = (width, height, currentTime) => {
      const particleCount = 70
      
      for (let i = 0; i < particleCount; i++) {
        const x = (Math.sin(currentTime * 0.2 + i) * 0.5 + 0.5) * width
        const y = (currentTime * 25 + i * 47) % (height + 200) - 100
        const size = 1.5 + Math.sin(currentTime * 1.5 + i) * 0.5
        
        if (y >= -50 && y <= height + 50) {
          ctx.beginPath()
          const opacity = 0.25 + Math.sin(currentTime * 2 + i) * 0.1
          
          if (i % 3 === 0) {
            // Red blood cell-like particles
            ctx.fillStyle = `rgba(239, 68, 68, ${opacity * 0.5})`
            ctx.arc(x, y, size * 1.3, 0, Math.PI * 2)
            ctx.fill()
          } else if (i % 3 === 1) {
            // Blue medical particles
            ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.4})`
            ctx.beginPath()
            for (let j = 0; j < 3; j++) {
              const angle = (j / 3) * Math.PI * 2 + currentTime * 2
              const px = x + Math.cos(angle) * size
              const py = y + Math.sin(angle) * size
              ctx.arc(px, py, size * 0.5, 0, Math.PI * 2)
            }
            ctx.fill()
          } else {
            // DNA fragment particles
            ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.5})`
            ctx.beginPath()
            ctx.moveTo(x, y - size)
            ctx.lineTo(x + size, y)
            ctx.lineTo(x, y + size)
            ctx.lineTo(x - size, y)
            ctx.fill()
          }
        }
      }
    }
    
    // Draw glowing orbs
    const drawGlowingOrbs = (width, height, currentTime) => {
      const orbCount = 10
      
      for (let i = 0; i < orbCount; i++) {
        const x = 0.15 + (i / orbCount) * 0.7
        const y = (currentTime * 18 + i * 65) % (height + 200) - 100
        
        if (y >= -80 && y <= height + 80) {
          ctx.beginPath()
          const gradient = ctx.createRadialGradient(x * width, y, 0, x * width, y, 22)
          gradient.addColorStop(0, `rgba(59, 130, 246, 0.25)`)
          gradient.addColorStop(1, `rgba(139, 92, 246, 0)`)
          ctx.fillStyle = gradient
          ctx.arc(x * width, y, 22, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, 0.15)`
          ctx.arc(x * width, y, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    
    const animate = () => {
      if (!canvas || !ctx) return
      
      time += 0.016
      const width = canvas.width
      const height = canvas.height
      
      if (width === 0 || height === 0) return
      
      ctx.clearRect(0, 0, width, height)
      
      // Medical-themed gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#0a0f1a')
      gradient.addColorStop(0.5, '#0f1420')
      gradient.addColorStop(1, '#0a0f1a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Draw subtle grid pattern
      ctx.save()
      ctx.globalAlpha = 0.08
      ctx.lineWidth = 0.5
      ctx.strokeStyle = '#3b82f6'
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 60) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }
      ctx.restore()
      
      // Draw glowing orbs
      drawGlowingOrbs(width, height, time)
      
      // Draw DNA strands
      dnaStrands.forEach((strand) => {
        drawStrand(strand, 0, width, height, time)
      })
      
      // Draw rungs (connections between strands)
      drawRungs(dnaStrands, width, height, time)
      
      // Draw nucleotide particles
      drawNucleotides(dnaStrands, width, height, time)
      
      // Draw base pairs
      drawBasePairs(dnaStrands, width, height, time)
      
      // Draw medical symbols
      drawMedicalSymbols(dnaStrands, width, height, time)
      
      // Draw floating medical particles
      drawMedicalParticles(width, height, time)
      
      // Add subtle vignette
      const vignette = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.3)
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
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [dnaStrands])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: 'block' }}
    />
  )
}