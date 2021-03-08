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
  onChange,
  options = []
}) {
  const inputRef = useRef(null)
  const [keyword, setKeyword] = useState('')
  const [placeholder, setPlaceholder] = useState('Select City')
  const [cursor, setCursor] = useState(0)
  const [focus, setFocus] = useState(false)
  const [results, setResults] = useState([])

  // const keydownPress = useKeyPress('ArrowDown', inputRef)
  // const keyupPress = useKeyPress('ArrowUp', inputRef)
  const enterPress = useKeyPress("Enter", inputRef);

  const refs = results.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  const handleClick = id =>
    refs[id]?.current?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    });

  useEffect(() => {
    const filtering = options.filter(option => option.name?.includes(keyword.toUpperCase()))
                          .sort((a, b) => a.name > b.name ? 1 : -1)
                          
    setPlaceholder(filtering[0]?.name ?? 'Select City')
    setResults(filtering)
    setCursor(0)
  }, [keyword, focus])

  // useEffect(() => {
  //   if (focus) {
  //     results.length > 0 && handleClick(results[0].id)
  //   }
  // }, [results])

  useEffect(() => {
    if (!results[cursor]) return

    handleClick(results[cursor].id)
    setPlaceholder(results[cursor].name)
  }, [cursor])

  // useEffect(() => {
  //   if (results.length && keydownPress) {
  //     console.log("down pressed")
  //     setCursor(prevState => {
  //       const newPosition = prevState < results.length - 1 ? prevState + 1 : prevState 
  //       handleClick(results[newPosition].id)
  //       setPlaceholder(results[newPosition].name)

  //       return newPosition
  //     })
  //   }
  // }, [keydownPress])

  // useEffect(() => {
  //   if (results.length && keyupPress) {
  //     console.log("up pressed")
  //     setCursor(prevState => {
  //      const newPosition = prevState > 0 ? prevState - 1 : prevState
  //      handleClick(results[newPosition].id)
  //      setPlaceholder(results[newPosition].name)

  //      return newPosition
  //     })
  //   }
  // }, [keyupPress])

  useEffect(() => {
    if (results.length && enterPress) {
      console.log("entered")
      if (!focus) return

      setFocus(false)
      const selectedItem = results[cursor]
      if (selectedItem) {
        onSetSelected(selectedItem)
        setKeyword(selectedItem.name)
      }
    }
  }, [enterPress])

  const onTextChange = (e) => {
    setKeyword(e.target.value)
    setFocus(true)
  }

  const onInputFocus = (e) => {
    console.log('input focused')
    setFocus(!focus)
  }

  const onInputBlur = (e) => {
    console.log('input blurred')
    if (!focus) {
      return
    }
    setFocus(false)
    const selectedItem = results[cursor]
    if (selectedItem) {
      onSetSelected(selectedItem)
      setKeyword(selectedItem.name)
    }
  }
  
  const onSelectItem = (e, option) => {
    e.preventDefault()
    setKeyword(option.name)
    setFocus(false)
    onSetSelected(option)
  }

  const onSetSelected = (option) => {
    onChange(option)
  }

  const keydownPress = (e) => {
    if (results.length > 0 && e.key === 'ArrowDown') {
      console.log("down pressed")
      e.preventDefault()
      if (!focus) return
      setCursor(prevState => prevState < results.length - 1 ? prevState + 1 : prevState)
    }

    if (results.length > 0 && e.key === 'ArrowUp') {
      console.log("up pressed")
      e.preventDefault()
      if (!focus) return
      setCursor(prevState => prevState > 0 ? prevState - 1 : prevState)
    }
  }

  console.log('focus', focus)

  return (
    <div style={{ position: 'relative'}}>
      <input 
        ref={inputRef}
        type='text' 
        autoComplete={'off'} 
        style={{border: '1px solid red', padding: '5px'}} 
        name='search' 
        value={keyword} 
        onChange={onTextChange} 
        onClick={onInputFocus}
        onBlur={onInputBlur}
        placeholder={placeholder}
        onKeyDown={keydownPress}
      />
      { focus && (
        results.length > 0 ? (
          <div style={{ position: 'absolute', width: '100%', backgroundColor: 'white' }}>
            <ul style={{ maxHeight: '250px', overflowY: 'scroll'}}>
              { results.map((option, i) => (
                <li 
                  key={option.id} 
                  style={{ backgroundColor: i === cursor ? 'gray' : '' }}
                  ref={refs[option.id]}
                  onMouseDown={(event) => onSelectItem(event, option)}
                >
                  <div>{option.name}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p>No Results !</p>
          </div>
        )
      ) }
    </div>
  )
}
