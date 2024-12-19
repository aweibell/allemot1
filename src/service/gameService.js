import {
    collection,
    doc,
    onSnapshot,
    addDoc,
    updateDoc,
    where,
    query,
    getDocs,
    getDoc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'

import { db } from './firebaseService'

export const gameService = {
    async findUserByEmail(email) {
        const q = query(collection(db, 'users'), where('email', '==', email))
        const snapshot = await getDocs(q)
        return snapshot.empty
            ? null
            : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
    },

    async findUserById(uid) {
        const docRef = doc(db, 'users', uid)
        const docSnap = await getDoc(docRef)
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
    },

    async updateGame(spelId, data) {
        return updateDoc(doc(db, 'spel', spelId), data)
    },
    listenToGame(spelId, callback) {
        return onSnapshot(doc(db, 'spel', spelId), snap =>
            callback(snap.data())
        )
    },

    async getDeltakarId(spelId) {
        const snapshot = await getDocs(
            collection(db, 'spel', spelId, 'deltakarId')
        )
        console.log('snapshot deltakar', snapshot)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },

    async getExperiments(spelId) {
        const snapshot = await getDocs(
            collection(db, 'spel', spelId, 'eksperiment')
        )
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },

    async addExperiment(spelId, data) {
        return addDoc(collection(db, 'spel', spelId, 'eksperiment'), data)
    },
    listenToExperiments(spelId, callback) {
        console.log('listenToExperiments spelId', spelId)
        return onSnapshot(
            collection(db, 'spel', spelId, 'eksperiment'),
            snap => {
                console.log(
                    'got snap.docs',
                    snap.docs.map(d => d.data())
                )
                callback(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            }
        )
    },

    listenToActiveExperiment(spelId, callback) {
        const activeStatuses = [
            'NESTE',
            'PRESENTERT',
            'STEMMING',
            'LUKKA',
            'SVAR_LAAST',
            'RESULTAT',
            'FERDIG',
        ]

        console.log(
            'listenToActiveExperiment for',
            spelId,
            'with callback',
            callback
        )
        return onSnapshot(
            query(collection(db, 'spel', spelId, 'eksperiment')),
            snap => {
                const activeExperiment = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .toReversed() // start from bottom
                    .find(d => activeStatuses.includes(d.status))
                callback(activeExperiment)
            },
            err => {
                console.warn('listenToActiveExperiment failed', err)
            }
        )
    },

    listenToGuesses(spelId, ekspId, callback) {
        return onSnapshot(
            collection(db, 'spel', spelId, 'eksperiment', ekspId, 'gjettingar'),
            snap =>
                callback(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        )
    },

    async createGame(game) {
        const ref = await addDoc(collection(db, 'spel'), game)
        return ref.id
    },

    async updateGameStatus(spelId, status) {
        await updateDoc(doc(db, 'spel', spelId), { status })
    },

    async updateExperiment(spelId, experimentId, data) {
        console.log(`spelId ${spelId} experimentId ${experimentId}`)
        console.log('data', data)
        return updateDoc(
            doc(db, 'spel', spelId, 'eksperiment', experimentId),
            data
        )
    },

    async updateExperimentStatus(spelId, ekspId, status) {
        await updateDoc(doc(db, 'spel', spelId, 'eksperiment', ekspId), {
            status,
        })
    },

    async setExperimentResult(spelId, ekspId, resultat) {
        return updateDoc(doc(db, 'spel', spelId, 'eksperiment', ekspId), {
            resultat,
        })
    },

    async submitGuess(spelId, ekspId, userId, value) {
        const spelDoc = await getDoc(doc(db, 'spel', spelId))
        const isDeltakar = spelDoc.data().deltakarId === userId
        const guessRef = doc(
            db,
            'spel',
            spelId,
            'eksperiment',
            ekspId,
            'gjettingar',
            userId
        )
        const existingGuess = await getDoc(guessRef)

        if (existingGuess.exists() && !isDeltakar) {
            throw new Error('Det er berre lov å gjetta ein gong :)')
        }

        await setDoc(guessRef, {
            value,
            timestamp: serverTimestamp(),
            userId,
        })
    },
    async getResultData(spelId, ekspId) {
        console.log('getResultatData', spelId, ekspId)
        const guessesSnap = await getDocs(
            collection(db, 'spel', spelId, 'eksperiment', ekspId, 'gjettingar')
        )
        console.log('guessesSnap', guessesSnap)
        const guesses = guessesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
        console.log('guesses', guesses)
        const ekspDoc = await getDoc(
            doc(db, 'spel', spelId, 'eksperiment', ekspId)
        )
        const spelDoc = await getDoc(doc(db, 'spel', spelId))

        const deltakarId = spelDoc.data().deltakarId
        const deltakarGuess = guesses.find(g => g.userId === deltakarId)?.value
        console.log('deltakarId og guess', deltakarId, deltakarGuess)
        const audienceGuesses = guesses.filter(g => g.userId !== deltakarId)
        const audienceAverage =
            audienceGuesses.reduce((sum, g) => sum + g.value, 0) /
            audienceGuesses.length

        console.log('guesses', guesses.length)
        return {
            deltakarGuess,
            audienceAverage: Math.round(audienceAverage),
            result: ekspDoc.data().resultat,
            range: Math.abs(deltakarGuess - ekspDoc.data().resultat),
            audienceWins:
                Math.abs(audienceAverage - ekspDoc.data().resultat) <=
                Math.abs(deltakarGuess - ekspDoc.data().resultat),
        }
    },
}
