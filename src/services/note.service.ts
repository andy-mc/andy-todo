import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/note';
import { NoteRepository } from '@/repositories/note.repository';

export class NoteService {
  private repository: NoteRepository;
  private static instance: NoteService;

  private constructor() {
    if (typeof window === 'undefined') {
      // En el servidor, creamos un repositorio mock
      this.repository = {} as NoteRepository;
    } else {
      // En el cliente, creamos el repositorio real
      this.repository = new NoteRepository();
    }
  }

  public static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  async createNote(content: string): Promise<Note> {
    const noteData: CreateNoteDTO = {
      content,
      userId: '1' // Using default user
    };

    return await this.repository.createNote(noteData);
  }

  async getNotes(): Promise<Note[]> {
    return await this.repository.getNotesByUserId();
  }

  async updateNote(noteId: string, content: string): Promise<void> {
    const updateData: UpdateNoteDTO = { content };
    await this.repository.updateNote(noteId, updateData);
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.repository.deleteNote(noteId);
  }
}

// Export a singleton instance
export const noteService = NoteService.getInstance();
