import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

export type Options = { id: string, name: string }

export default function Select({
  onChange,
  initialValue=undefined,
  value=undefined,
  placeholder='Selection',
  options = [],
  searchable=true,
  mandatory=false,
}: {
  onChange: (arg: Options) => void
  initialValue?: Options|undefined
  value?: Options|undefined
  placeholder?: string
  options: Options[]
  searchable?: boolean
  mandatory?: boolean
}) {
  if (!searchable && !mandatory) options = [{id: '', name: placeholder}, ...options]

  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const [keyword, setKeyword] = useState('')
  const [cursor, setCursor] = useState(0)
  const [results, setResults] = useState<Options[]>([])
  const [selected, setSelected] = useState<Options|undefined>(initialValue)
  
  React.useEffect(() => {
    if (value === undefined)
      return
    setSelected(value)    
  }, [value])

  type test = {
    [x: string]: React.RefObject<HTMLLIElement>
  }
  const refs = results.reduce((acc: test, value: Options) => {
    acc[value.id] = React.createRef<HTMLLIElement>();
    return acc;
  }, {});

  const toggleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsOpen((isOpen) => !isOpen)
    inputRef?.current?.focus()
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleClick = (id: string) =>
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

    const selectedIndex = filtering.findIndex((el) => el.id === selected?.id)
    setResults(filtering)
    setCursor(selectedIndex < 0 ? 0 : selectedIndex)
  }, [keyword, isOpen])

  useEffect(() => {
    if (!results[cursor]) return

    handleClick(results[cursor].id)
  }, [cursor, isOpen])

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    closeMenu()
    setKeyword('')
  }
  
  const onSelectItem = (e: React.MouseEvent<HTMLLIElement, globalThis.MouseEvent>, option: Options) => {
    e.preventDefault()
    onSetSelected(option)
  }

  const onSetSelected = (option: Options) => {
    setKeyword('')
    setSelected(option)
    closeMenu()
    onChange(option)
    inputRef?.current?.blur()
  }

  const keydownPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (results.length > 0 && e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(prevState => prevState < results.length - 1 ? prevState + 1 : prevState)
    }

    if (results.length > 0 && e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(prevState => prevState > 0 ? prevState - 1 : prevState)
    }

    if (results.length && e.key === 'Enter') { 
      e.preventDefault()
      const selectedItem = results[cursor]
      if (selectedItem) {
        onSetSelected(selectedItem)
      }
    }
  }

  return (
    <div className='relative'>
      <div 
        className='flex group justify-between items-center cursor-pointer border rounded px-2 py-1 text-sm w-28 md:w-56 hover:border-gray-500 hover:shadow-sm'
        onKeyDown={keydownPress}
        onClick={toggleOpen}
        tabIndex={0}
      >
        <div className='flex'>
          <input 
            ref={inputRef}
            type='text' 
            autoComplete={'off'} 
            readOnly={!searchable}
            className={`${!searchable || !isOpen ? 'w-0' : keyword && 'w-full'} w-1 w-min-0 focus:outline-none`}
            name='search' 
            value={keyword} 
            onChange={onTextChange} 
            onClick={onInputBlur}
            onBlur={onInputBlur}
          />
          {!keyword && <div className='-ml-1'>{selected?.name || placeholder}</div>}
        </div>
        { !searchable && (
          <div 
            className='flex pointer-events-none justify-center items-center w-8 h-6 -mr-2 border-l border-gray-300'>
            <AiFillCaretDown className='text-gray-300 group-hover:text-gray-500' />
          </div>
        )}
      </div>
      { results.length > 0 ? (
          <div className={`${!isOpen && 'hidden'} max-h-72 overflow-auto z-10 origin-top-right absolute right-0 mt-2 md:w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
            <ul className="py-1">
              { results.map((option, i) => {
                let bgColor = ''
                if (option.name === selected?.name) {
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
          <div className={`${!isOpen && 'hidden'} z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
            <p className='py-1 block px-4 py-2 text-sm text-gray-500'>NO RESULTS FOUND</p>
          </div>
        )
      }
    </div>
  )
}
