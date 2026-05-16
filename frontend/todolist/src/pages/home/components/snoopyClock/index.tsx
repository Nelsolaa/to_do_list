import { useEffect, useState } from 'react'
import snoopySleeping from '../../../../images/snoopy_deitado.jpg'
import './index.css'

function SnoopyClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const time = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <aside className="snoopy-clock" aria-label="Relogio">
      <img className="snoopy-clock__image" src={snoopySleeping} alt="Snoopy deitado" />
      <time className="snoopy-clock__time">{time}</time>
    </aside>
  )
}

export default SnoopyClock
