'use client'

import { useState } from 'react'
import { Umbrella, Shell, Waves, Trash2, Sun, Cloud, Palmtree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type Todo = {
  id: number
  text: string
  completed: boolean
}

export function BlockPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const todosPerPage = 10

  // Styles for the background and container
  const containerStyle = {
    minHeight: 'calc(100vh - 4rem)',
    width: '100%',
    margin: 0,
    padding: '2rem 0',
    backgroundImage: 'url("/beach_pixel_art.png")',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'auto'
  }

  const mainContentStyle = {
    width: '100%',
    maxWidth: '800px',
    padding: '0 2rem',
    margin: '0 auto'
  }

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    maxWidth: '600px',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
  }

  const buttonStyle = {
    background: 'rgba(255, 166, 0, 0.9)',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 140, 0, 1)'
    }
  }

  const deleteButtonStyle = {
    background: 'rgba(255, 99, 71, 0.9)',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 69, 0, 1)'
    }
  }

  const completeButtonStyle = {
    background: 'rgba(46, 139, 87, 0.9)',
    color: 'white',
    '&:hover': {
      background: 'rgba(34, 139, 34, 1)'
    }
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText } : todo
    ))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const indexOfLastTodo = currentPage * todosPerPage
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo)
  const totalPages = Math.ceil(todos.length / todosPerPage)

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ color: '#1e3a5f', fontSize: '2rem', textAlign: 'center' }}>Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Agregar nueva tarea..."
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(30, 58, 95, 0.3)',
                  borderRadius: '0.5rem'
                }}
              />
              <Button onClick={addTodo} style={buttonStyle}>
                <Shell size={20} />
              </Button>
            </div>
            <div className="space-y-2">
              {currentTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-2 rounded"
                  style={{
                    background: todo.completed ? 'rgba(144, 238, 144, 0.2)' : 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(30, 58, 95, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {editingId === todo.id ? (
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(30, 58, 95, 0.3)'
                      }}
                    />
                  ) : (
                    <span style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#666' : '#1e3a5f',
                      flex: 1
                    }}>
                      {todo.text}
                    </span>
                  )}
                  <div className="flex space-x-2">
                    {editingId === todo.id ? (
                      <>
                        <Button onClick={saveEdit} style={completeButtonStyle}>
                          <Sun size={16} />
                        </Button>
                        <Button onClick={() => setEditingId(null)} style={deleteButtonStyle}>
                          <Cloud size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => toggleComplete(todo.id)} style={completeButtonStyle}>
                          <Umbrella size={16} />
                        </Button>
                        <Button onClick={() => startEdit(todo)} style={buttonStyle}>
                          <Waves size={16} />
                        </Button>
                        <Button onClick={() => deleteTodo(todo.id)} style={deleteButtonStyle}>
                          <Palmtree size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={buttonStyle}
            >
              Anterior
            </Button>
            <span style={{ color: '#1e3a5f' }}>Página {currentPage} de {totalPages}</span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={buttonStyle}
            >
              Siguiente
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}