import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material'
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
import { db } from '../../service/firebaseService'
import { useRoute } from 'preact-iso'

const isDeltakar = (gameData, userId) => {
    return gameData.deltakarId === userId
}

export default function GameParticipant({ userId }) {
    const [game, setGame] = useState(null)
    const [activeExperiment, setActiveExperiment] = useState(null)
    const [guess, setGuess] = useState('')
    const [hasGuessed, setHasGuessed] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState(null) // 'deltakar' or 'publikum'
    const { params } = useRoute()
    console.log('route params', params)
    const spelkode = params.spelkode

    // Find game and determine user role
    const findGame = async code => {
        const q = query(collection(db, 'spel'), where('spelkode', '==', code))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            throw new Error('Fann ikkje spelet', spelkode)
        }

        const gameData = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
        }

        // Set user role based on whether they are the deltakar
        setUserRole(isDeltakar(gameData, userId) ? 'deltakar' : 'publikum')

        return gameData
    }

    // Subscribe to active experiment
    const setupExperimentSubscription = (spelId, callback) => {
        const q = query(
            collection(db, `spel/${spelId}/eksperiment`),
            where('status', '==', 'open')
        )

        return onSnapshot(q, snapshot => {
            const activeExperiments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            callback(activeExperiments[0] || null)
        })
    }

    // Submit guess - different path for deltakar vs publikum
    const submitGuess = async (spelId, ekspId, userGuess) => {
        const path =
            userRole === 'deltakar'
                ? `spel/${spelId}/eksperiment/${ekspId}` // Deltakar guess stored directly in experiment
                : `spel/${spelId}/eksperiment/${ekspId}/gjettingar/${userId}` // Publikum guess stored in gjettingar

        const guessRef = doc(db, path)

        if (userRole === 'publikum') {
            // Check if publikum user has already guessed
            const existing = await getDoc(guessRef)
            if (existing.exists()) {
                throw new Error(
                    'Du har allerede gjettet på dette eksperimentet'
                )
            }
        }

        const guessData =
            userRole === 'deltakar'
                ? { deltakarGuess: Number(userGuess) }
                : {
                      gjetting: Number(userGuess),
                      submittedAt: serverTimestamp(),
                  }

        await setDoc(guessRef, guessData, { merge: true })
    }

    // Initialize game and subscriptions
    useEffect(() => {
        const initGame = async () => {
            try {
                setLoading(true)
                const foundGame = await findGame(spelkode)
                setGame(foundGame)

                const unsubscribe = setupExperimentSubscription(
                    foundGame.id,
                    experiment => {
                        setActiveExperiment(experiment)
                        setHasGuessed(false)
                        setResults(null)
                    }
                )

                return unsubscribe
            } catch (error) {
                setError(`Kunne ikkje finne spelet ${spelkode}`)
            } finally {
                setLoading(false)
            }
        }

        initGame()
    }, [spelkode, userId])

    // Subscribe to experiment results
    useEffect(() => {
        if (activeExperiment && hasGuessed) {
            const ekspRef = doc(
                db,
                `spel/${game.id}/eksperiment/${activeExperiment.id}`
            )

            return onSnapshot(ekspRef, doc => {
                if (doc.exists() && doc.data().status === 'completed') {
                    setResults({
                        id: doc.id,
                        ...doc.data(),
                    })
                }
            })
        }
    }, [game?.id, activeExperiment?.id, hasGuessed])

    const handleSubmitGuess = async () => {
        try {
            await submitGuess(game.id, activeExperiment.id, guess)
            setHasGuessed(true)
            setGuess('')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    if (!game) {
        return <Alert severity="info">Spel ikke funnet</Alert>
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Card>
                <CardHeader
                    title={`Spel #${spelkode}`}
                    subheader={`Din rolle: ${userRole === 'deltakar' ? 'Deltakar' : 'Publikum'}`}
                />
                <CardContent>
                    {activeExperiment ? (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">
                                {activeExperiment.title}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {activeExperiment.description}
                            </Typography>

                            {!hasGuessed ? (
                                <Box sx={{ mt: 3 }}>
                                    <TextField
                                        type="number"
                                        label={
                                            userRole === 'deltakar'
                                                ? 'Ditt svar'
                                                : 'Din gjetting'
                                        }
                                        value={guess}
                                        onChange={e => setGuess(e.target.value)}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitGuess}
                                        disabled={!guess}
                                        fullWidth
                                    >
                                        {userRole === 'deltakar'
                                            ? 'Send inn svar'
                                            : 'Send inn gjetting'}
                                    </Button>
                                </Box>
                            ) : (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    {userRole === 'deltakar'
                                        ? 'Ditt svar er registrert. Venter på publikum...'
                                        : 'Din gjetting er registrert. Venter på resultat...'}
                                </Alert>
                            )}
                        </Box>
                    ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Venter på at neste eksperiment skal starte...
                        </Alert>
                    )}

                    {results && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Resultater</Typography>
                            <Typography>
                                Rett svar: {results.correctResult}
                            </Typography>
                            <Typography>
                                Deltakar sitt svar: {results.deltakarGuess}
                                {userRole === 'deltakar' ? ' (ditt svar)' : ''}
                            </Typography>
                            <Typography>
                                Publikum gjennomsnitt:{' '}
                                {results.publikumConsensus}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}
