import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CategoriaItem from './components/CategoriaItem'
import { getCategorias, createCategoria } from '../../actions/categorias.action'

export interface Categoria { id: number; nombre: string; descripcion: string }

export default function Categorias() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const { mutate: create } = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setMostrarForm(false)
      setForm({ nombre: '', descripcion: '' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create(form)
  }

  if (isLoading) return <p>Cargando categorías...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Categorías</h1>
          <p style={{ color: '#888', fontSize: 13 }}>Clasificación de productos farmacéuticos</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '10px 20px', background: '#0f4c35', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          + Agregar categoría
        </button>
      </div>

      {mostrarForm && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 440 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['nombre', 'Nombre'], ['descripcion', 'Descripción']].map(([name, label]) => (
              <div key={name}>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, textTransform: 'uppercase', fontWeight: 500 }}>{label}</label>
                <input name={name} value={(form as any)[name]} onChange={e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} required />
              </div>
            ))}
            <button type="submit" style={{ padding: 12, background: '#0f4c35', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Guardar</button>
          </form>
        </div>
      )}

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Nombre', 'Descripción', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categorias.map((c: any, i: number) => (
              <CategoriaItem
                key={c.id_categoria}
                categoria={c}
                isLast={i === categorias.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}