function getQrMarkup(svg: SVGSVGElement) {
  const markup = svg.outerHTML.includes('xmlns=')
    ? svg.outerHTML
    : svg.outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')

  return markup
}

export function downloadQrSvg(svg: SVGSVGElement, fileName: string) {
  const markup = getQrMarkup(svg)
  const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function copyQrSvg(svg: SVGSVGElement) {
  if (typeof window === 'undefined' || !('ClipboardItem' in window) || !navigator.clipboard?.write) {
    throw new Error('clipboard_not_supported')
  }

  const markup = getQrMarkup(svg)
  const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
  const clipboardItem = new window.ClipboardItem({
    'image/svg+xml': blob,
  })

  await navigator.clipboard.write([clipboardItem])
}
