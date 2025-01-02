import {
    doc,
    getDoc,
    updateDoc,
    query,
    collection,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebaseService'

export const isSuperAdmin = async userId => {
    try {
        // console.log('checking superadmin status for:', userId)
        const userDocRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists()) {
            console.log('no user document found')
            return false
        }

        const userData = userDoc.data()
        // console.log('user data:', userData)
        return userData?.isSuperAdmin === true
    } catch (error) {
        console.error('Error checking superadmin status:', error)
        return false
    }
}
/**
 * Subscribe to a list of users with email as auth type
 * @param callback
 * @returns {Unsubscribe}
 */
export const subscribeToEmailUsers = callback => {
    const q = query(collection(db, 'users'), where('authType', '==', 'email'))

    return onSnapshot(
        q,
        snapshot => {
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            callback(users)
        },
        error => {
            console.error('Error in email users subscription:', error)
            callback([])
        }
    )
}

// Check if user can be vert
export const canUserCreateSpel = async userId => {
    if (!userId) return false
    
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return false
    
    const userData = userDoc.data()
    return (
        (userData?.email && userData?.canBeVert === true) || 
        userData?.isSuperAdmin === true
    )
}

// Super admin function to grant vert privileges
export const grantVertPrivilege = async targetUserId => {
    return await updateDoc(doc(db, 'users', targetUserId), {
        canBeVert: true,
    })
}

// Find user by email (for assigning deltakar)
export const findUserByEmail = async email => {
    const q = query(collection(db, 'users'), where('email', '==', email))

    const snapshot = await getDocs(q)
    if (snapshot.empty) {
        return null
    }

    return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
    }
}

export const getAllSpel = async () => {
    try {
        const q = query(collection(db, 'spel'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
    } catch (error) {
        console.error('Greidde ikkje henta spel:', error)
        return []
    }
}

// Assign deltakar role for a specific spel
export const assignDeltakar = async (currentUserId, spelId, deltakarEmail) => {
    // Verify current user is vert for this spel
    const spelDoc = await getDoc(doc(db, 'spel', spelId))
    if (!spelDoc.exists() || spelDoc.data().createdBy !== currentUserId) {
        throw new Error('Unauthorized action')
    }

    // Find the deltakar user
    const deltakar = await findUserByEmail(deltakarEmail)
    if (!deltakar) {
        throw new Error('User not found')
    }

    // Update the spel with deltakar info
    await updateDoc(doc(db, 'spel', spelId), {
        deltakarId: deltakar.id,
        deltakarNickname: deltakar.nickname,
        updatedAt: serverTimestamp(),
    })

    // Optionally: Update the user's role for this specific spel
    await updateDoc(doc(db, 'users', deltakar.id), {
        currentRole: 'deltakar',
    })
}
