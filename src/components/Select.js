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
  defaultValue='',
  defaultPlaceholder='Select City',
  options = [],
  searchable=true,
}) {
  if (!searchable) options = [{id: 0, name: defaultPlaceholder}, ...options]

  const inputRef = useRef(null)
  const [keyword, setKeyword] = useState(defaultValue)
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder)
  const [cursor, setCursor] = useState(0)
  const [focus, setFocus] = useState(false)
  const [results, setResults] = useState([])

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
    const filtering = options.filter(option => {
      if (!searchable) return true;
      return option.name?.includes(keyword.toUpperCase())
    }).sort((a, b) => {
      if (a.id === 0 || b.id === 0) {
        return 1
      } else {
        return a.name > b.name ? 1 : -1
      }
    })
                          
    setPlaceholder(filtering[0]?.name ?? defaultPlaceholder)
    setResults(filtering)
    setCursor(0)
  }, [keyword, focus])

  useEffect(() => {
    if (!results[cursor]) return

    handleClick(results[cursor].id)
    setPlaceholder(results[cursor].name)
  }, [cursor])

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

  return (
    <div style={{ position: 'relative'}}>
      <input 
        ref={inputRef}
        type='text' 
        autoComplete={'off'} 
        readOnly={!searchable}
        className="border border-2 rounded-r px-2 py-1 w-full"
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
          <div className="max-h-72 overflow-auto z-10 origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ul className="py-1">
              { results.map((option, i) => (
                <li 
                  key={option.id} 
                  className={`${(i === cursor || option.name === keyword ? 'bg-gray-200 text-gray-900' : '' )} cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900`}
                  ref={refs[option.id]}
                  onMouseDown={(event) => onSelectItem(event, option)}
                >
                  <div>{option.name}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <p className='py-1 block px-4 py-2 text-sm text-gray-500'>NO RESULTS FOUND</p>
          </div>
        )
      ) }
    </div>
  )
}
