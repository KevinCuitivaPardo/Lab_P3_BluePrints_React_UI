// Servicio "apiclient": consume el API REST real con Axios.
// Implementa la misma interfaz que apimock (getAll, getByAuthor, getByAuthorAndName, create).
import http from './httpClient.js'

const apiclient = {
  async getAll() {
    const { data } = await http.get('/blueprints')
    return data
  },

  async getByAuthor(author) {
    const { data } = await http.get(`/blueprints/${encodeURIComponent(author)}`)
    return data
  },

  async getByAuthorAndName(author, name) {
    const { data } = await http.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return data
  },

  async create(payload) {
    const { data } = await http.post('/blueprints', payload)
    return data
  },
}

export default apiclient
