export interface Note {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateNoteDTO = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoteDTO = Pick<Note, 'content'>;
