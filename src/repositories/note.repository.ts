import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase/services';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/note';

const COLLECTION_NAME = 'notes';
const DEFAULT_USER_ID = '1'; // Temporary default user

export class NoteRepository {
  async createNote(data: CreateNoteDTO): Promise<Note> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot perform Firestore operations on the server');
    }

    const db = getDb();
    const notesRef = collection(db, COLLECTION_NAME);
    
    const docRef = await addDoc(notesRef, {
      ...data,
      userId: DEFAULT_USER_ID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...data,
      userId: DEFAULT_USER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getNotesByUserId(userId: string = DEFAULT_USER_ID): Promise<Note[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    const db = getDb();
    const notesRef = collection(db, COLLECTION_NAME);
    const q = query(notesRef, where("userId", "==", userId));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate()
    } as Note));
  }

  async updateNote(noteId: string, data: UpdateNoteDTO): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot perform Firestore operations on the server');
    }

    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, noteId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot perform Firestore operations on the server');
    }

    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, noteId);
    await deleteDoc(docRef);
  }
}
