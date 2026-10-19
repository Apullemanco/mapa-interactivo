export const REGIONS = [
  'Norteamérica',
  'Centroamérica y Caribe',
  'Sudamérica',
  'Europa',
  'África',
  'Asia',
  'Oceanía',
] as const

export type Region = (typeof REGIONS)[number]

const SOUTH_AMERICA_TZ = new Set([
  'Bogota',
  'Caracas',
  'Lima',
  'Guayaquil',
  'La_Paz',
  'Santiago',
  'Punta_Arenas',
  'Sao_Paulo',
  'Montevideo',
  'Asuncion',
  'Guyana',
  'Paramaribo',
  'Cayenne',
  'Belem',
  'Fortaleza',
  'Recife',
  'Manaus',
  'Cuiaba',
  'Porto_Velho',
  'Boa_Vista',
  'Rio_Branco',
  'Bahia',
  'Maceio',
  'Araguaina',
  'Santarem',
  'Campo_Grande',
  'Noronha',
  'Eirunepe',
  'Buenos_Aires',
  'Cordoba',
  'Mendoza',
])

const MEXICO_TZ = new Set([
  'Mexico_City',
  'Cancun',
  'Merida',
  'Monterrey',
  'Matamoros',
  'Chihuahua',
  'Ciudad_Juarez',
  'Ojinaga',
  'Mazatlan',
  'Bahia_Banderas',
  'Hermosillo',
  'Tijuana',
])

function regionFromCoords(lat: number, lng: number): Region {
  if (lng < -30) {
    if (lat < 7) return 'Sudamérica'
    if (lat < 24 && lng > -118) return 'Centroamérica y Caribe'
    return 'Norteamérica'
  }
  if (lat < -10 && lng > 110) return 'Oceanía'
  if (lng > 150 || (lat < 0 && lng > 130)) return 'Oceanía'
  if (lat > 36 && lng < 45) return 'Europa'
  if (lng < 52 && lat < 37) return 'África'
  return 'Asia'
}

export function classifyRegion(
  lat: number,
  lng: number,
  timezone?: string,
): Region {
  if (!timezone) return regionFromCoords(lat, lng)
  const [zone, ...rest] = timezone.split('/')
  const city = rest[rest.length - 1] ?? ''

  switch (zone) {
    case 'America':
      if (rest[0] === 'Argentina' || SOUTH_AMERICA_TZ.has(city))
        return 'Sudamérica'
      if (MEXICO_TZ.has(city)) return 'Norteamérica'
      if (lat < 24 && lng > -118 && lng < -59) return 'Centroamérica y Caribe'
      if (lat < 7) return 'Sudamérica'
      return 'Norteamérica'
    case 'Europe':
      return 'Europa'
    case 'Africa':
      return 'África'
    case 'Asia':
      return 'Asia'
    case 'Australia':
    case 'Pacific':
      return 'Oceanía'
    case 'Indian':
      return lng < 60 ? 'África' : 'Asia'
    default:
      return regionFromCoords(lat, lng)
  }
}
