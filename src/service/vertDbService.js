// Admin/vert functions
import { db, auth } from './firebaseService.js'
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore'
import { canUserCreateSpel } from './superAdminDbService.js'
import { SPEL_STATUS } from '../lib/types.js'

export const getSpelById = async spelId => {
    try {
        const q = query(collection(db, 'spel'), where('id', '==', spelId))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
    } catch (error) {
        console.error('Error fetching spel:', error)
        throw error
    }
}

export const getSpelByUser = async () => {
    try {
        const q = query(
            collection(db, 'spel'),
            where('createdBy', '==', auth.currentUser.uid)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
    } catch (error) {
        console.error('Error fetching spel:', error)
        throw error
    }
}

// Create new spel
export const createSpel = async ({ namn, dato }) => {
    console.log(namn)
    console.log(`createSpel ${namn} at ${dato} by ${auth.currentUser.uid}`)
    try {
        return await addDoc(collection(db, 'spel'), {
            namn,
            dato,
            deltakarId: null,
            status: SPEL_STATUS.OPPRETTA.value,
            createdBy: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error('Error creating spel:', error)
        throw error
    }
}

// Create new spel (with role verification)
export const createSpelWithAuth = async (userId, spelData) => {
    if (!(await canUserCreateSpel(userId))) {
        throw new Error('User is not authorized to create spel')
    }

    return await addDoc(collection(db, 'spel'), {
        ...spelData,
        createdBy: userId,
        status: 'upcoming',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
}

// Add eksperiment to spel
export const addEksperiment = async (spelId, eksperimentData) => {
    try {
        return await addDoc(collection(db, `spel/${spelId}/eksperiment`), {
            ...eksperimentData,
            status: 'upcoming',
            createdAt: serverTimestamp(),
        })
    } catch (error) {
        console.error('Error adding eksperiment:', error)
        throw error
    }
}
export const startSpel = async spelId => {
    try {
        await updateDoc(doc(db, 'spel', spelId), {
            status: 'active',
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error('Error starting spel:', error)
        throw error
    }
}

export const openEksperimentForGjetting = async (spelId, ekspId) => {
    try {
        await updateDoc(doc(db, `spel/${spelId}/eksperiment/${ekspId}`), {
            status: 'open',
            votingStartTime: serverTimestamp(),
            votingEndTime: new Date(Date.now() + 30000), // example: 30 seconds to vote
        })
    } catch (error) {
        console.error('Error opening eksperiment:', error)
        throw error
    }
}

export const lockEksperiment = async (spelId, ekspId) => {
    try {
        await updateDoc(doc(db, `spel/${spelId}/eksperiment/${ekspId}`), {
            status: 'locked',
        })
    } catch (error) {
        console.error('Error locking eksperiment:', error)
        throw error
    }
}

export const completeEksperiment = async (spelId, ekspId, correctResult) => {
    try {
        await updateDoc(doc(db, `spel/${spelId}/eksperiment/${ekspId}`), {
            status: 'completed',
            correctResult,
            publikumConsensus: await calculatePublikumConsensus(spelId, ekspId),
        })
    } catch (error) {
        console.error('Error completing eksperiment:', error)
        throw error
    }
}

// Helper function to calculate average/median of publikum gjettingar
const calculatePublikumConsensus = async (spelId, ekspId) => {
    return 0 || spelId + ekspId // TODO: Fix or remove :)
    // Implementation depends on your specific rules
    // How do you want to calculate the consensus?
}
