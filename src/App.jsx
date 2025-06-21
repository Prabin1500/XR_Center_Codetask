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
    <div className="h-screen flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black">
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
      <div className="bg-gray-900/80 backdrop-blur-md border-t border-gray-700 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 w-full">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-900/50 border border-indigo-500">
              <span className="text-lg sm:text-xl font-bold text-indigo-200">{deckCount}</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">
              {deckCount === 1 ? 'card remaining' : 'cards remaining'}
            </div>
          </div>

          <div className="flex flex-1 flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button 
                key={n}
                className={`
                  relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm
                  transition-border duration-200 ease-out whitespace-nowrap cursor-pointer text-gray-500 
                  ${
                    selectedDeal === n
                      ? 'bg-indigo-600 text-white font-bold shadow-indigo-500/50'
                      : ''
                  }
                  border ${selectedDeal === n ? 'border-indigo-400' : ''}
                `}
                onClick={() => {
                  requestDeal(n)
                  setSelectedDeal(n)
                }}
              >
                Deal {n}
                {selectedDeal === n && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
                  </span>
                )}
              </button>
            ))}
            <button 
              onClick={resetDeck}
              className='px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 transition-all rounded-md sm:rounded-lg shadow-sm sm:shadow-md text-xs sm:text-sm text-white whitespace-nowrap cursor-pointer'
            >
              🔁 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
