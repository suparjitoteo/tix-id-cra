import React from 'react'

export default function Loading({ text='Loading', speed=300 }) {
  const [loadingText, setLoadingText] = React.useState(text)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setLoadingText((currentText) => currentText === `${text}...` ? text : `${currentText}.`)
    }, speed)

    return () => window.clearInterval(id)
  }, [text])

  return (
    <div className='flex justify-center w-full min-h-inherit items-center'>
      <p className='text-3xl'>{loadingText}</p>
    </div>
  )
}
