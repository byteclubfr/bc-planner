export const toggle = (set, v) => set.includes(v) ? set.delete(v) : set.add(v)
