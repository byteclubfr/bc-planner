var cachedRefs = {}

export default function cacheRef (key, ref) {
  const kkey = key + '/' + JSON.stringify(ref)
  if (kkey in cachedRefs) {
    return cachedRefs[kkey]
  } else {
    cachedRefs[kkey] = ref
    return ref
  }
}
