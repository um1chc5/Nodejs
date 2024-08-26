async function getMime() {
  const mime = (await import('mime')).default
  return mime
}

export default getMime
