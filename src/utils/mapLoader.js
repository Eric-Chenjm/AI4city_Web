let shanghaiMapPromise = null

export const loadShanghaiMap = () => {
  if (shanghaiMapPromise) return shanghaiMapPromise

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)

  shanghaiMapPromise = fetch('data/shanghai_full.json', { signal: controller.signal })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features) || data.features.length === 0) {
        throw new Error('Invalid map data')
      }
      return data
    })
    .catch((err) => {
      shanghaiMapPromise = null
      throw err
    })
    .finally(() => clearTimeout(timer))

  return shanghaiMapPromise
}
