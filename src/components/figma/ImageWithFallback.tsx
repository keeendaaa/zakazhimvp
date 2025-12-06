import React, { useState, useEffect, useMemo } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const BASE_PATH = '/mvp/'

// Нормализует путь к изображению, добавляя базовый путь для относительных путей
function normalizeImagePath(src: string | undefined): string {
  if (!src) return ''
  
  // Если это полный URL (http/https), возвращаем как есть
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // Если путь начинается с /images/, добавляем базовый путь
  if (src.startsWith('/images/')) {
    return `${BASE_PATH}images${src.substring('/images'.length)}`
  }
  
  // Если путь уже начинается с /mvp/, возвращаем как есть
  if (src.startsWith('/mvp/')) {
    return src
  }
  
  // Для остальных относительных путей добавляем базовый путь
  if (src.startsWith('/')) {
    return `${BASE_PATH}${src.substring(1)}`
  }
  
  // Для относительных путей без / добавляем базовый путь
  return `${BASE_PATH}${src}`
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const { src, alt, style, className, ...rest } = props

  // Нормализуем путь к изображению
  const normalizedSrc = useMemo(() => normalizeImagePath(src), [src])

  useEffect(() => {
    // Reset error state when src changes
    setDidError(false)
  }, [normalizedSrc])

  const handleError = () => {
    setDidError(true)
  }

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={normalizedSrc} />
        </div>
      </div>
    )
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={handleError}
      {...rest}
    />
  )
}
