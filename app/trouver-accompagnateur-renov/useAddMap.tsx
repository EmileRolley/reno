import maplibregl from 'maplibre-gl'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

const defaultCenter =
  // Saint Malo [-1.9890417068124002, 48.66284934737089]
  [-1.678, 48.11]
export const defaultZoom = 8
const defaultHash = `#${defaultZoom}/${defaultCenter[1]}/${defaultCenter[0]}`

export default function useAddMap(mapContainerRef, setLocation) {
  const [map, setMap] = useState(null)
  const mobile = false
  useEffect(() => {
    if (!mapContainerRef.current) return undefined

    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.protomaps.com/styles/v2/light.json?key=8df307109ae3eabc`,
      center: defaultCenter,
      zoom: defaultZoom,
      hash: true,
    })
    newMap.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      'top-right',
    )

    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })

    newMap.addControl(geolocate)

    geolocate.on('geolocate', function (e) {
      console.log('bleu ', e.coords)
      setLocation(e.coords)
    })

    newMap.on('style.load', function () {
      console.log('ONLOAD STYLE', newMap._mapId)
    })
    newMap.on('load', () => {
      console.log('ONLOAD', newMap._mapId)
      setMap(newMap)

      console.log('MOBILE', mobile, window.location.hash, defaultHash)
      if (window.location.hash === defaultHash && mobile) geolocate.trigger()
    })

    return () => {
      setMap(null)
      newMap?.remove()
    }
  }, [setMap, mapContainerRef, mobile, setLocation]) // styleUrl not listed on purpose

  return map
}