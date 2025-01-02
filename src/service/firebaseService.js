// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import {
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'preact/hooks'
import { signal } from '@preact/signals'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase first
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
auth.languageCode = 'no'
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID)
export const storage = getStorage(app)

// Then set up connection monitoring
const connectionState = signal('unknown')

const initConnectionMonitoring = () => {
    let firestoreConnected = false
    let browserOnline = navigator.onLine

    const updateConnectionState = () => {
        // Consider connected if browser is online (simplify the check)
        connectionState.value = browserOnline ? 'connected' : 'disconnected'
        console.log('Connection state updated:', {
            browserOnline,
            firestoreConnected,
            finalState: connectionState.value
        })
    }

    // Basic online/offline monitoring
    const handleOnline = () => {
        console.log('Browser reports online')
        browserOnline = true
        updateConnectionState()
    }
    
    const handleOffline = () => {
        console.log('Browser reports offline')
        browserOnline = false
        updateConnectionState()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial browser state
    browserOnline = navigator.onLine
    updateConnectionState()

    // Monitor Firestore connection state for logging only
    const unsubscribe = onSnapshot(
        doc(db, '.info/connected'),
        (snapshot) => {
            firestoreConnected = snapshot.exists() && snapshot.data()?.connected === true
            console.log('Firestore connection state:', firestoreConnected)
        },
        (error) => {
            console.debug('Firestore connection monitor error:', error)
            firestoreConnected = false
        }
    )

    return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        unsubscribe()
    }
}

// Initialize connection monitoring after Firebase is initialized
initConnectionMonitoring()

export const useAuth = () => {
    const [user, setUser] = useState(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user)
            setLoading(false)
        })

        // Cleanup subscription
        return () => unsubscribe()
    }, [])

    return { user, loading }
}

onAuthStateChanged(auth, async user => {
    if (user) {
        const userRef = doc(db, 'users', user.uid)

        // Check if user document already exists
        const userDoc = await getDoc(userRef)

        /* Throws this error on connection failure:
        firebaseService.js:58 [2024-12-05T15:42:40.302Z]  @firebase/firestore: Firestore (11.0.2): Could not reach Cloud Firestore backend. Connection failed 1 times. Most recent error: FirebaseError: [code=unknown]: Fetching auth token failed: Firebase: Error (auth/network-request-failed).
        This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.
         */
        if (!userDoc.exists()) {
            // Create new user document
            try {
                await setDoc(userRef, {
                    authType: user.isAnonymous ? 'anonymous' : 'email',
                    createdAt: serverTimestamp(),
                    lastActive: serverTimestamp(),
                    ...(user.isAnonymous
                        ? {
                              nickname: `Guest_${Math.floor(Math.random() * 1000)}`,
                          }
                        : {
                              email: user.email,
                          }),
                })
                console.log('Created new user document')
            } catch (error) {
                console.error('Error creating user document:', error)
            }
        } else {
            // Update lastActive timestamp
            try {
                await setDoc(
                    userRef,
                    {
                        lastActive: serverTimestamp(),
                    },
                    { merge: true }
                )
            } catch (error) {
                console.error('Error updating user activity:', error)
            }
        }
    }
})

export const logoutUser = async () => {
    try {
        await signOut(auth)
        return true
    } catch (error) {
        console.error('Error signing out:', error)
        return false
    }
}

export const getConnectionState = () => {
    return connectionState.value
}
