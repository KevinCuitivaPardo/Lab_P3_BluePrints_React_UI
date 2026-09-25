import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BlueprintForm from '../components/BlueprintForm.jsx'
import { createBlueprint } from '../features/blueprints/blueprintsSlice.js'

export default function CreateBlueprintPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { createStatus, createError } = useSelector((s) => s.blueprints)

  const handleSubmit = async (payload) => {
    const result = await dispatch(createBlueprint(payload))
    if (createBlueprint.fulfilled.match(result)) {
      navigate(`/blueprints/${payload.author}/${payload.name}`)
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      {createStatus === 'failed' && (
        <div className="banner error">
          <span>{createError || 'No se pudo crear el blueprint.'}</span>
        </div>
      )}
      <BlueprintForm onSubmit={handleSubmit} submitting={createStatus === 'loading'} />
    </div>
  )
}
