import { db } from './firebaseService'
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore'

// Find game by code
export const findGameByCode = async gameCode => {
    const q = query(collection(db, 'spel'), where('gameCode', '==', gameCode))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
        throw new Error('Spel ikke funnet')
    }

    return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
    }
}

// Subscribe to active experiment for a game
export const subscribeToActiveExperiment = (spelId, callback) => {
    const q = query(
        collection(db, `spel/${spelId}/eksperiment`),
        where('status', '==', 'open')
    )

    return onSnapshot(q, snapshot => {
        const activeExperiments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
        // We expect only one experiment to be open at a time
        callback(activeExperiments[0] || null)
    })
}

// Submit a guess for an experiment
export const submitGuess = async (spelId, ekspId, userId, guess) => {
    const guessRef = doc(
        db,
        `spel/${spelId}/eksperiment/${ekspId}/gjettingar/${userId}`
    )

    // Check if user has already guessed
    const existing = await getDoc(guessRef)
    if (existing.exists()) {
        throw new Error('Du har allerede gjettet på dette eksperimentet')
    }

    await setDoc(guessRef, {
        gjetting: Number(guess),
        submittedAt: serverTimestamp(),
    })
}

// Subscribe to experiment results
export const subscribeToResults = (spelId, ekspId, callback) => {
    const ekspRef = doc(db, `spel/${spelId}/eksperiment/${ekspId}`)

    return onSnapshot(ekspRef, doc => {
        if (doc.exists() && doc.data().status === 'completed') {
            callback({
                id: doc.id,
                ...doc.data(),
            })
        }
    })
}

// Initialize anonymous user profile
export const initializeAnonymousUser = async (userId, nickname) => {
    await setDoc(doc(db, 'users', userId), {
        nickname,
        authType: 'anonymous',
        createdAt: serverTimestamp(),
    })
}
