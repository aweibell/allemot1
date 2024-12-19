import { Box, Card, TextField, Button } from '@mui/material'
import { useState } from 'preact/hooks'
import { gameService } from '../service/gameService'

export const ResultInput = ({ spelId, experiment }) => {
    const [result, setResult] = useState('')

    const handleSubmit = () => {
        console.log('handleSubmit', result)
        gameService.setExperimentResult(spelId, experiment.id, Number(result))
        setResult('')
    }

    if (!experiment) {
        return <Card variant="translucent">Missing experiment</Card>
    }

    return (
        <Card variant="translucent" sx={{ p: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                }}
            >
                <TextField
                    type="number"
                    label="Faktisk resultat"
                    value={result}
                    onChange={e => setResult(e.target.value)}
                    inputProps={{
                        min: experiment.utfallMin,
                        max: experiment.utfallMax,
                    }}
                    fullWidth
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        !result ||
                        result < experiment.utfallMin ||
                        result > experiment.utfallMax
                    }
                >
                    Registrer
                </Button>
            </Box>
        </Card>
    )
}
