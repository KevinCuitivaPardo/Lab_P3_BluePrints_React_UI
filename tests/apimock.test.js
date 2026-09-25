import { describe, it, expect } from 'vitest'
import apimock from '../src/services/apimock.js'

describe('apimock service', () => {
  it('getAll devuelve blueprints de prueba', async () => {
    const data = await apimock.getAll()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('getByAuthor filtra por autor', async () => {
    const data = await apimock.getByAuthor('juan.perez')
    expect(data.every((bp) => bp.author === 'juan.perez')).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('getByAuthorAndName retorna un blueprint puntual', async () => {
    const bp = await apimock.getByAuthorAndName('juan.perez', 'casa')
    expect(bp.name).toBe('casa')
    expect(bp.points.length).toBeGreaterThan(0)
  })

  it('getByAuthorAndName lanza error si no existe', async () => {
    await expect(apimock.getByAuthorAndName('nadie', 'nada')).rejects.toThrow()
  })

  it('create agrega un nuevo blueprint consultable después', async () => {
    const created = await apimock.create({
      author: 'test.user',
      name: 'nuevo',
      points: [{ x: 1, y: 1 }],
    })
    expect(created.author).toBe('test.user')
    const fetched = await apimock.getByAuthorAndName('test.user', 'nuevo')
    expect(fetched.name).toBe('nuevo')
  })
})
