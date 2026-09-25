import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from '../src/components/PrivateRoute.jsx'

function renderWithRoute(initialPath) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <p>Create page</p>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirige a /login cuando no hay token', () => {
    renderWithRoute('/create')
    expect(screen.getByText(/Login page/i)).toBeInTheDocument()
  })

  it('renderiza el contenido protegido cuando hay token', () => {
    localStorage.setItem('token', 'fake-jwt')
    renderWithRoute('/create')
    expect(screen.getByText(/Create page/i)).toBeInTheDocument()
  })
})
