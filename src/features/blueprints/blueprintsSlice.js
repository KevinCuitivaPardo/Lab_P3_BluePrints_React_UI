import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const fetchAuthors = createAsyncThunk(
  'blueprints/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      const data = await blueprintsService.getAll()
      // Expecting API returns array of {author, name, points}
      return [...new Set(data.map((bp) => bp.author))]
    } catch (err) {
      return rejectWithValue(err.message || 'Error al obtener autores')
    }
  },
)

export const fetchByAuthor = createAsyncThunk(
  'blueprints/fetchByAuthor',
  async (author, { rejectWithValue }) => {
    try {
      const items = await blueprintsService.getByAuthor(author)
      return { author, items }
    } catch (err) {
      return rejectWithValue(err.message || 'Error al obtener los blueprints del autor')
    }
  },
)

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }, { rejectWithValue }) => {
    try {
      return await blueprintsService.getByAuthorAndName(author, name)
    } catch (err) {
      return rejectWithValue(err.message || 'Error al obtener el blueprint')
    }
  },
)

export const createBlueprint = createAsyncThunk(
  'blueprints/createBlueprint',
  async (payload, { rejectWithValue }) => {
    try {
      return await blueprintsService.create(payload)
    } catch (err) {
      return rejectWithValue(err.message || 'Error al crear el blueprint')
    }
  },
)

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
    byAuthorStatus: 'idle',
    byAuthorError: null,
    createStatus: 'idle',
    createError: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || a.error.message
      })
      .addCase(fetchByAuthor.pending, (s) => {
        s.byAuthorStatus = 'loading'
        s.byAuthorError = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.byAuthorStatus = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.byAuthorStatus = 'failed'
        s.byAuthorError = a.payload || a.error.message
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.error = a.payload || a.error.message
      })
      .addCase(createBlueprint.pending, (s) => {
        s.createStatus = 'loading'
        s.createError = null
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        s.createStatus = 'succeeded'
        const bp = a.payload
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
        if (!s.authors.includes(bp.author)) s.authors.push(bp.author)
      })
      .addCase(createBlueprint.rejected, (s, a) => {
        s.createStatus = 'failed'
        s.createError = a.payload || a.error.message
      })
  },
})

export const { clearCurrent } = slice.actions
export default slice.reducer
