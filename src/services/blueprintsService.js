// Habilita el cambio entre apimock y apiclient con una sola línea de código,
// controlado por VITE_USE_MOCK en el .env
import apimock from './apimock.js'
import apiclient from './apiclient.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const blueprintsService = useMock ? apimock : apiclient

export default blueprintsService
