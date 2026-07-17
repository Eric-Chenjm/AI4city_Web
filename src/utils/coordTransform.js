const a = 6378137.0
const f = 1 / 298.257222101
const b = a * (1 - f)
const e2 = (a * a - b * b) / (a * a)
const e4 = e2 * e2
const e6 = e4 * e2

const L0 = 120 * Math.PI / 180
const k0 = 1.0
const x0 = 500000.0
const y0 = 0.0

const mercatorToLatLng = (x, y) => {
  const dx = (x - x0) / k0
  const dy = (y - y0) / k0

  const mu = dy / (a * (1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256))
  
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2))
  const e1_2 = e1 * e1
  const e1_3 = e1_2 * e1
  const e1_4 = e1_3 * e1
  const e1_5 = e1_4 * e1
  
  const phi1 = mu + (3 * e1 / 2 - 27 * e1_3 / 32) * Math.sin(2 * mu) +
              (21 * e1_2 / 16 - 55 * e1_4 / 32) * Math.sin(4 * mu) +
              (151 * e1_3 / 96) * Math.sin(6 * mu) +
              (1097 * e1_4 / 512) * Math.sin(8 * mu)
  
  const N1 = a / Math.sqrt(1 - e2 * Math.sin(phi1) * Math.sin(phi1))
  const T1 = Math.tan(phi1) * Math.tan(phi1)
  const C1 = e2 * Math.cos(phi1) * Math.cos(phi1) / (1 - e2)
  const R1 = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(phi1) * Math.sin(phi1), 1.5)
  const D = dx / N1
  
  let phi = phi1 - N1 * Math.tan(phi1) / R1 * (D * D / 2 -
            (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * e2) * D * D * D * D / 24 +
            (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * e2 - 3 * C1 * C1) * D * D * D * D * D * D / 720)
  
  let lambda = L0 + D / Math.cos(phi1) -
               (1 + 2 * T1 + C1) * D * D * D / 6 +
               (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * e2 + 24 * T1 * T1) * D * D * D * D * D / 120
  
  phi = phi * 180 / Math.PI
  lambda = lambda * 180 / Math.PI
  
  return [lambda, phi]
}

const transformCoords = (coords) => {
  if (Array.isArray(coords)) {
    if (coords.length === 2 && typeof coords[0] === 'number') {
      return mercatorToLatLng(coords[0], coords[1])
    }
    return coords.map(c => transformCoords(c))
  }
  return coords
}

const transformGeoJson = (geojson) => {
  if (!geojson || !geojson.features) return geojson
  
  return {
    ...geojson,
    features: geojson.features.map(feature => {
      if (feature.geometry) {
        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: transformCoords(feature.geometry.coordinates)
          }
        }
      }
      return feature
    })
  }
}

export { mercatorToLatLng, transformCoords, transformGeoJson }