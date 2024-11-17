'use client'

import { useState, useEffect } from 'react'
import { Check, Shell, Pencil, Trash2, Sun, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Note } from '@/types/note'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { NoteService } from '@/services/note.service'

export function BlockPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [noteService, setNoteService] = useState<NoteService | null>(null)
  const notesPerPage = 10

  // Initialize noteService
  useEffect(() => {
    const initService = async () => {
      if (typeof window !== 'undefined') {
        const { noteService } = await import('@/services/note.service')
        setNoteService(noteService)
      }
    }
    initService()
  }, [])

  // Load notes when noteService is available
  useEffect(() => {
    if (noteService) {
      loadNotes()
    }
  }, [noteService])

  const loadNotes = async () => {
    if (!noteService) return
    
    try {
      const fetchedNotes = await noteService.getNotes()
      setNotes(fetchedNotes)
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async () => {
    if (!noteService || !newNote.trim()) return

    try {
      const createdNote = await noteService.createNote(newNote.trim())
      setNotes(prev => [createdNote, ...prev])
      setNewNote('')
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!noteService || !editText.trim()) return

    try {
      await noteService.updateNote(noteId, editText.trim())
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId
            ? { ...note, content: editText.trim(), updatedAt: new Date() }
            : note
        )
      )
      setEditingId(null)
      setEditText('')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!noteService) return

    try {
      await noteService.deleteNote(noteId)
      setNotes(prev => prev.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

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

  const indexOfLastNote = currentPage * notesPerPage
  const indexOfFirstNote = indexOfLastNote - notesPerPage
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote)
  const totalPages = Math.ceil(notes.length / notesPerPage)

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ color: '#1e3a5f', fontSize: '2rem', textAlign: 'center' }}>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Agregar nueva nota..."
                onKeyPress={(e) => e.key === 'Enter' && handleCreateNote()}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(30, 58, 95, 0.3)',
                  borderRadius: '0.5rem'
                }}
              />
              <Button onClick={handleCreateNote} style={buttonStyle}>
                <Shell size={20} />
              </Button>
            </div>
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center p-4">Cargando notas...</div>
              ) : currentNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col p-3 rounded"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(30, 58, 95, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="flex items-center justify-between">
                    {editingId === note.id ? (
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateNote(note.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(30, 58, 95, 0.3)'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#1e3a5f', flex: 1 }}>
                        {note.content}
                      </span>
                    )}
                    <div className="flex space-x-2 ml-2">
                      {editingId === note.id ? (
                        <>
                          <Button onClick={() => handleUpdateNote(note.id)} style={completeButtonStyle}>
                            <Sun size={16} />
                          </Button>
                          <Button onClick={() => setEditingId(null)} style={deleteButtonStyle}>
                            <Cloud size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => setEditingId(note.id)} style={buttonStyle}>
                            <Pencil size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteNote(note.id)} style={deleteButtonStyle}>
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Actualizado {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: es })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {notes.length > notesPerPage && (
            <CardFooter className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    ...buttonStyle,
                    opacity: currentPage === i + 1 ? 1 : 0.7,
                  }}
                >
                  {i + 1}
                </Button>
              ))}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}