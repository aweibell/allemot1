import { Box, Button, Card, Slider, Typography } from '@mui/material'
import { useState } from 'preact/hooks'
import { formatTimeValue } from '../../lib/utils'

export const WaitingScreen = ({ message }) => (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography sx={{ mt: 2 }}>{message}</Typography>
    </Box>
)

export const WelcomeScreen = ({ spel }) => (
    <Card sx={{ mx: 'auto', mt: 4, p: 3, textAlign: 'center' }}>
        <Typography variant="h4">{spel.namn}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
            Spelet startar om ikkje lenge!
        </Typography>
        <Typography sx={{ fontWeight: 'bold', mt: 2 }}>{spel.dato}</Typography>
        <Typography sx={{ mt: 2 }}>Er du klar? :)</Typography>
    </Card>
)

export const ReadyScreen = () => (
    <Card sx={{ mx: 'auto', mt: 4, p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Neste eksperiment kjem snart!</Typography>
        {/*<Typography sx={{ mt: 2 }}>{experiment.title}</Typography>*/}
    </Card>
)

export const PresentExperiment = ({ experiment }) => {

    const formatValue = (val) => {
        return experiment.timeFormat ? formatTimeValue(val) : val;
    }
    return (
    <Card
        variant="transparent"
        sx={{ mx: 'auto', mt: 4, p: 3, textAlign: 'center' }}
    >
        <Typography variant={'h4'}>{experiment.title}</Typography>
        <Typography sx={{ mt: 2 }}>{experiment.description}</Typography>
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
            Svaret ligg ein stad mellom {formatTimeValue(experiment.utfallMin)} og{' '}
            {formatTimeValue(experiment.utfallMax)}
        </Typography>
    </Card>
)
} 

export const GuessInput = ({ experiment, existingGuess, onSubmit }) => {
    // Set initial slider position to either the existing guess or the middle of the allowed range
    const [value, setValue] = useState(
        existingGuess ?? (experiment.utfallMin + experiment.utfallMax) / 2
    )

    const formatValue = (val) => {
        return experiment.timeFormat ? formatTimeValue(val) : val;
    }

    return (
        <Card variant="translucent" sx={{ mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h5">{experiment.title}</Typography>
            <Typography sx={{ mt: 2 }}>{experiment.description}</Typography>
            {experiment.image && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                        src={experiment.image}
                        alt={experiment.title}
                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                </Box>
            )}
            <Box sx={{ mt: 3 }}>
                <Slider
                    value={existingGuess || value}
                    onChange={(e, val) => setValue(val)}
                    min={experiment.utfallMin}
                    max={experiment.utfallMax}
                    valueLabelDisplay="on"
                    valueLabelFormat={formatValue}
                    disabled={existingGuess !== null}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                        mb: 2
                    }}
                >
                    <Typography>{formatValue(experiment.utfallMin)}</Typography>
                    <Typography>{formatValue(experiment.utfallMax)}</Typography>
                </Box>
                {existingGuess !== null ? (
                    <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        bgcolor: 'background.paper',
                        borderRadius: 1
                    }}>
                        <Typography>
                            Du gjetta {formatValue(existingGuess)}
                        </Typography>
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => onSubmit(value)}
                        sx={{ mt: 2 }}
                    >
                        Send svar
                    </Button>
                )}
            </Box>
        </Card>
    )
}

export const QuoteScreen = ({ experiment }) => (
    <Card
        variant="transparent"
        sx={{ mx: 'auto', mt: 4, p: 3, textAlign: 'center' }}
    >
        <Typography variant="h5">Eksperiment ferdig</Typography>
        {experiment.quote && (
            <Typography variant="h6" sx={{ mt: 3, fontStyle: 'italic' }}>
                "{experiment.quote}"
            </Typography>
        )}
    </Card>
)
