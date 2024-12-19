import { useEffect, useState } from 'preact/hooks'
import { gameService } from '../service/gameService.js'
import { Box, Card, LinearProgress, Typography } from '@mui/material'

export const ExperimentDetailView = ({ spelId, experiment }) => {
    const [guesses, setGuesses] = useState([])
    const [deltakarId, setDeltakarId] = useState()

    useEffect(() => {
        if (!experiment) return
        return gameService.listenToGuesses(spelId, experiment.id, setGuesses)
    }, [experiment?.id])

    useEffect(() => {
        if (!spelId) return
        const deltakarId = gameService.getDeltakarId(spelId)
        setDeltakarId(deltakarId)
    }, [spelId])

    if (!experiment) return null

    const avgGuess =
        guesses.reduce((acc, g) => acc + g.value, 0) / (guesses.length || 1)
    const guess = guesses.find(g => g.userId === deltakarId)
    const deltakarGuess = guess?.value
    console.log(guesses.length, 'guess', guess, 'deltakarGuess', deltakarGuess)
    console.log('guesses', guesses)
    console.log('deltakarId', experiment.deltakarId)

    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6">{experiment.title}</Typography>
            <Typography>{experiment.description}</Typography>

            {experiment.image && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                        src={experiment.image}
                        alt={experiment.title}
                        style={{ maxWidth: '20%' }}
                    />
                </Box>
            )}

            <Box sx={{ mt: 2 }}>
                <Typography>
                    Verdiområde: {experiment.utfallMin} - {experiment.utfallMax}
                </Typography>
                <Typography>
                    <strong>{guesses.length}</strong> gjettingar
                </Typography>
                <Typography>
                    Resultat: <strong>{experiment.resultat}</strong>
                </Typography>
                <Typography>Gjennomsnitt: {avgGuess.toFixed(1)}</Typography>
                {deltakarGuess && (
                    <Typography>Deltakar gjetting: {deltakarGuess}</Typography>
                )}

                <LinearProgress
                    variant="determinate"
                    value={
                        (avgGuess /
                            (experiment.utfallMax - experiment.utfallMin)) *
                        100
                    }
                    sx={{ mt: 1 }}
                />
            </Box>
        </Card>
    )
}