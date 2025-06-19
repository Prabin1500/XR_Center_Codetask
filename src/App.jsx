import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Deck from '../components/Deck'
import Card from '../components/Card'
import { animateDeal } from './animations/dealcards'
import './app.css'

export default function App() {
  const [dealtCards, setDealtCards] = useState([])
  const [deckCount, setDeckCount] = useState(0)
  const [selectedDeal, setSelectedDeal] = useState(null)

  const dealtRefs = useRef([])
  const deckGroupRef = useRef()
  const handleDeckChange = (count) => setDeckCount(count)
  const handleDeal = (cards) => {
    dealtRefs.current = cards.map(() => React.createRef())
    setDealtCards(cards)
  }
  
  useEffect(() => {
    if(!dealtRefs.current || !Array.isArray(dealtRefs.current)) return
    if (dealtRefs.current.length === 0 || !deckGroupRef.current) return
    
    const tryAnimate = () => {
      const ready = dealtRefs.current.every(ref => ref?.current)

      if(ready) {
        animateDeal(dealtRefs.current, deckGroupRef)
      } else {
        requestAnimationFrame(tryAnimate)
      }
    }

    tryAnimate()
  },[dealtCards])

  const requestDeal = (n) =>
    window.dispatchEvent(new CustomEvent('deal-request', { detail: n }))
  
  const resetDeck = () => {
    setSelectedDeal(null)
    window.dispatchEvent(new Event('reset-deck'))
  }

  return (
    <div className="h-screen flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex-1 relative h-full">
        <Canvas
          className="absolute inset-0"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2, 12], fov: 50 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[5, 5, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Deck 
            onDeal={handleDeal}
            onDeckChange={handleDeckChange}
            groupRef={deckGroupRef}
          />

          {dealtCards.map((code, idx) => {
            const count = dealtCards.length
            //const xOffset = -((count - 1) / 2) + idx * 1.2
            const rotY = (idx - (count - 1) / 2) * 0.1
            const origin = deckGroupRef.current.position
            return (
              <Card
                key={`${code}-${idx}`}
                ref={dealtRefs.current[idx]}
                code={code}
                dealt={true}
                rotation={[0, rotY, 0]}
                position={[origin.x, origin.y, origin.z]}
              />
            )
          })}
        </Canvas>
      </div>
      <div className="bg-gray-800 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="text-lg font-medium text-indigo-300">Deck: {deckCount} cards left</div>
        

        <div className="flex flex-wrap gap-2 text-black ">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button 
              className={`px-4 py-2 rounded-md shadow-md text-sm transition font-medium ${
                selectedDeal === n
                  ? 'text-black'
                  : 'text-gray-400'
              } `}
              key={n} 
              onClick={() => {
                requestDeal(n)
                setSelectedDeal(n)
              }}

            >
              Deal {n}
            </button>
          ))}
          <button 
            onClick={resetDeck}
            className='px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-md shadow-md text-sm'
          >
           🔁 Reset Deck
          </button>
        </div>
      </div>
    </div>
  )
}
