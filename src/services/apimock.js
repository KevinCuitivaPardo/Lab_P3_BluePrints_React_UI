// Servicio "apimock": retorna datos de prueba desde memoria, sin backend.
// Implementa la misma interfaz que apiclient (getAll, getByAuthor, getByAuthorAndName, create).

let blueprints = [
  {
    author: 'juan.perez',
    name: 'casa',
    points: [
      { x: 40, y: 300 },
      { x: 40, y: 120 },
      { x: 160, y: 40 },
      { x: 280, y: 120 },
      { x: 280, y: 300 },
      { x: 40, y: 300 },
    ],
  },
  {
    author: 'juan.perez',
    name: 'garage',
    points: [
      { x: 60, y: 260 },
      { x: 60, y: 160 },
      { x: 220, y: 160 },
      { x: 220, y: 260 },
    ],
  },
  {
    author: 'maria.gomez',
    name: 'piscina',
    points: [
      { x: 80, y: 80 },
      { x: 320, y: 80 },
      { x: 320, y: 240 },
      { x: 80, y: 240 },
      { x: 80, y: 80 },
    ],
  },
  {
    author: 'maria.gomez',
    name: 'jardin',
    points: [
      { x: 30, y: 330 },
      { x: 120, y: 250 },
      { x: 210, y: 330 },
      { x: 300, y: 250 },
      { x: 390, y: 330 },
    ],
  },
]

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

const apimock = {
  async getAll() {
    await delay()
    return blueprints.map((bp) => ({ ...bp }))
  },

  async getByAuthor(author) {
    await delay()
    return blueprints.filter((bp) => bp.author === author).map((bp) => ({ ...bp }))
  },

  async getByAuthorAndName(author, name) {
    await delay()
    const bp = blueprints.find((b) => b.author === author && b.name === name)
    if (!bp) throw new Error(`Blueprint ${name} de ${author} no encontrado`)
    return { ...bp }
  },

  async create(payload) {
    await delay()
    const exists = blueprints.some(
      (bp) => bp.author === payload.author && bp.name === payload.name,
    )
    if (exists) throw new Error('Ya existe un blueprint con ese nombre para el autor')
    const created = { author: payload.author, name: payload.name, points: payload.points || [] }
    blueprints = [...blueprints, created]
    return created
  },
}

export default apimock
