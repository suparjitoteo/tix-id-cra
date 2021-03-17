import React, { useEffect, useRef, useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

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
    inputRef.current.addEventListener('keydown', downHandler)
    inputRef.current.addEventListener('keyup', upHandler)

    return () => {
      inputRef.current?.removeEventListener('keydown', downHandler)
      inputRef.current?.removeEventListener('keyup', upHandler)
    }
  })

  return keyPressed
}

export default function Select({
  onChange,
  defaultValue={},
  defaultPlaceholder='Select City',
  options = [],
  searchable=true,
}) {
  if (!searchable) options = [{id: '', name: defaultPlaceholder}, ...options]

  const inputRef = useRef(null)
  const [keyword, setKeyword] = useState('')
  const [placeholder, setPlaceholder] = useState(defaultValue?.name ?? defaultPlaceholder)
  const [cursor, setCursor] = useState(0)
  const [focus, setFocus] = useState(false)
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(defaultValue)

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
      if (a.id === '' || b.id === '') {
        return 1
      } else {
        return a.name > b.name ? 1 : -1
      }
    })

    const selectedIndex = filtering.findIndex((el) => el.id === selected.id)
    setResults(filtering)
    setCursor((selectedIndex < 0 || !focus) ? 0 : selectedIndex)
  }, [keyword, focus])

  useEffect(() => {
    if (!results[cursor]) return

    handleClick(results[cursor].id)
  }, [cursor])

  useEffect(() => {
    if (results.length && enterPress) {
      console.log("entered")
      if (!focus) return

      const selectedItem = results[cursor]
      if (selectedItem) {
        onSetSelected(selectedItem)
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
    setKeyword('')
  }
  
  const onSelectItem = (e, option) => {
    e.preventDefault()
    onSetSelected(option)
  }

  const onSetSelected = (option) => {
    inputRef.current.blur()
    setFocus(false)
    setKeyword('')
    setSelected(option)
    setPlaceholder(option.name)
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
      <div className='flex group items-center cursor-pointer'>
        <input 
        ref={inputRef}
        type='text' 
        autoComplete={'off'} 
        readOnly={!searchable}
        className="border rounded px-2 py-1 text-sm w-full placeholder-black group-hover:border-gray-300 group-hover:shadow-sm"
        name='search' 
        value={keyword} 
        onChange={onTextChange} 
        onClick={onInputFocus}
        onBlur={onInputBlur}
        placeholder={placeholder}
        onKeyDown={keydownPress}
      />
      { !searchable && (
        <div 
          className='flex pointer-events-none justify-center items-center w-8 h-6 -ml-8 border-l border-gray-300'>
          <AiFillCaretDown className='text-gray-300 group-hover:text-gray-500' />
        </div>
      )}
      </div>
      { focus && (
        results.length > 0 ? (
          <div className="max-h-72 overflow-auto z-10 origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ul className="py-1">
              { results.map((option, i) => {
                let bgColor = ''
                if (option.name === selected.name) {
                  bgColor = 'bg-blue-200 text-gray-900'
                } else if (i === cursor) {
                  bgColor = 'bg-gray-200 text-gray-900'
                }
                return (
                  <li 
                    key={option.id} 
                    className={`${bgColor} cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900`}
                    ref={refs[option.id]}
                    onMouseDown={(event) => onSelectItem(event, option)}
                  >
                    <div>{option.name}</div>
                  </li>
                )
              })}
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
