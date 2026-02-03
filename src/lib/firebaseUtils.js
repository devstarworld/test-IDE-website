import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth'
import { auth, db } from './firebase'

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Firestore functions
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { id: docRef.id, error: null }
  } catch (error) {
    return { id: null, error: error.message }
  }
}

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
    } else {
      return { data: null, error: 'Document not found' }
    }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName)
    
    // Apply conditions if provided
    if (conditions.length > 0) {
      const queryConstraints = conditions.map(condition => {
        if (condition.type === 'where') {
          return where(condition.field, condition.operator, condition.value)
        } else if (condition.type === 'orderBy') {
          return orderBy(condition.field, condition.direction || 'asc')
        } else if (condition.type === 'limit') {
          return limit(condition.value)
        }
        return null
      }).filter(Boolean)
      
      q = query(q, ...queryConstraints)
    }
    
    const querySnapshot = await getDocs(q)
    const documents = []
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })
    
    return { data: documents, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// User profile functions
export const createUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getUserProfile = async (userId) => {
  return await getDocument('users', userId)
}