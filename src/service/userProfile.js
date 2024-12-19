import { db } from './firebaseService.js'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore'

export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
        const { email } = user
        const isAnonymous = user.isAnonymous || false

        try {
            await setDoc(userRef, {
                email: email || null,
                isAnonymous,
                nickname:
                    additionalData.nickname ||
                    `Player${Math.floor(Math.random() * 10000)}`,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                totalScore: 0,
                gamesPlayed: 0,
                ...additionalData,
            })
        } catch (error) {
            console.error('Error creating user profile:', error)
        }
    } else {
        // Update last login
        await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
        })
    }

    return userRef
}

export const updateUserProfile = async (userId, data) => {
    const userRef = doc(db, 'users', userId)
    try {
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error('Error updating user profile:', error)
        throw error
    }
}

export const fetchUserProfile = async userId => {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() }
    }

    return null
}
