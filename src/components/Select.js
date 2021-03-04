import React, { useEffect, useRef, useState } from 'react'

const useKeyPress = (targetKey, inputRef) => {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = (event) => {
    if (event.key === targetKey) {
      event.preventDefault()
      setKeyPressed(true)
    }
  }

  const upHandler = (event) => {
    if (event.key === targetKey) {
      event.preventDefault()
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    inputRef?.current.addEventListener('keydown', downHandler)
    inputRef?.current.addEventListener('keyup', upHandler)

    return () => {
      inputRef?.current.removeEventListener('keydown', downHandler)
      inputRef?.current.removeEventListener('keyup', upHandler)
    }
  })

  return keyPressed
}

export default function Select({
  options = []
}) {
  const inputRef = useRef(null)
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState('')
  const keydownPress = useKeyPress('ArrowDown', inputRef)
  const keyupPress = useKeyPress('ArrowUp', inputRef)
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0)

  const refs = results.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  const handleClick = id =>
    refs[id]?.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });

  useEffect(() => {
    if (!keyword) {
      setResults([])
    } else {
      const filtering = options.filter(option => option.name?.includes(keyword.toUpperCase()))
                             .sort((a, b) => a.name > b.name ? 1 : -1)
      setResults(filtering)
    }
  }, [keyword])

  useEffect(() => {
    if (results.length && keydownPress) {
      console.log("down pressed")
      setCursor(prevState => {
        const newPosition = prevState < results.length - 1 ? prevState + 1 : prevState 
        handleClick(results[newPosition].id)

        return newPosition
      })
    }
  }, [keydownPress])

  useEffect(() => {
    if (results.length && keyupPress) {
      console.log("up pressed")
      setCursor(prevState => {
       const newPosition = prevState > 0 ? prevState - 1 : prevState
       handleClick(results[newPosition].id)

       return newPosition
      })
    }
  }, [keyupPress])

  useEffect(() => {
    if (results.length && enterPress) {
      console.log("entered")
      setSelected(results[cursor])
    }
  }, [cursor, enterPress])

  const onTextChange = (e) => {
    setKeyword(e.target.value)
    setCursor(0)
  }

  return (
    <div>
      <input 
        ref={inputRef}
        type='text' 
        autoComplete={'off'} 
        style={{backgroundColor: 'red'}} 
        name='search' 
        value={keyword} 
        onChange={onTextChange} 
      />
      { results.length > 0 && (
        <div>
          <ul style={{ maxHeight: '250px', overflowY: 'scroll'}}>
            { results.map((option, i) => (
              <li 
                key={option.id} 
                style={{ backgroundColor: i === cursor ? 'gray' : '' }}
                ref={refs[option.id]}
              >
                <div>{option.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
