import { gsap } from 'gsap'
import * as THREE from 'three'

export function hoverAnimation(cardRef) {
    if (!cardRef.current) return {}
    
    const card = cardRef.current
    let cardPosition = new THREE.Vector3().copy(card.position)
    let animation = null

    const updateCardPosition = () => {
        cardPosition.copy(card.position)
    }

    const hoverIn = () => {
        if (animation) animation.kill()
        updateCardPosition() 
        
        animation = gsap.to(card.position, {
            z: cardPosition.z + 0.8, 
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => { animation = null }
        })
    }

    const hoverOut = () => {
        if (animation) animation.kill()
        
        animation = gsap.to(card.position, {
            x: cardPosition.x, 
            y: cardPosition.y, 
            z: cardPosition.z, 
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => { 
                card.position.copy(cardPosition)
            }
        })
    }

    return {
        onPointerOver: hoverIn,
        onPointerOut: hoverOut,
        updateCardPosition: () => {
            cardPosition.copy(card.position)
        }
    }
}