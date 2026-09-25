import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, byAuthorStatus, byAuthorError } = useSelector((s) => s.blueprints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput) return
    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  return (
    <div className="grid layout-two-cols">
      <section className="grid" style={{ gap: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              placeholder="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && getBlueprints()}
            />
            <button className="btn primary" onClick={getBlueprints}>
              Get blueprints
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>
          {byAuthorStatus === 'loading' && <p>Cargando...</p>}
          {byAuthorStatus === 'failed' && (
            <div className="banner error">
              <span>{byAuthorError || 'Ocurrió un error al consultar los blueprints.'}</span>
              <button className="btn" onClick={getBlueprints}>
                Reintentar
              </button>
            </div>
          )}
          {!items.length && byAuthorStatus !== 'loading' && byAuthorStatus !== 'failed' && (
            <p>Sin resultados.</p>
          )}
          {!!items.length && (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Blueprint name</th>
                    <th style={{ textAlign: 'right' }}>Number of points</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td>{bp.name}</td>
                      <td style={{ textAlign: 'right' }}>{bp.points?.length || 0}</td>
                      <td>
                        <button className="btn" onClick={() => openBlueprint(bp)}>
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: 12, fontWeight: 700 }}>Total user points: {totalPoints}</p>
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Current blueprint</h3>
        <label htmlFor="current-blueprint-name">Nombre del plano actual</label>
        <input
          id="current-blueprint-name"
          className="input"
          value={current?.name || ''}
          readOnly
          placeholder="Ningún blueprint seleccionado"
        />
        <div style={{ marginTop: 16 }}>
          <BlueprintCanvas points={current?.points || []} />
        </div>
      </section>
    </div>
  )
}
