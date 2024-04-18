import { useEffect } from 'react'

function useWindowGrew(windowGrew: () => void) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        windowGrew()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowGrew])
}

export default useWindowGrew
