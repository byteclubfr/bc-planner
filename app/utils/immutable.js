export function toggle (set, v) {
  return set.includes(v) ? set.delete(v) : set.add(v)
}
