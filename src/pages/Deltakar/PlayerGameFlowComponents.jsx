import { Box, Button, Card, Slider, Typography } from '@mui/material'
import { useState } from 'preact/hooks'

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

export const PresentExperiment = ({ experiment }) => (
    <Card
        variant="transparent"
        sx={{ mx: 'auto', mt: 4, p: 3, textAlign: 'center' }}
    >
        <Typography variant={'h4'}>{experiment.title}</Typography>
        <Typography sx={{ mt: 2 }}>{experiment.description}</Typography>
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
            Svaret ligg ein stad mellom {experiment.utfallMin} og{' '}
            {experiment.utfallMax}
        </Typography>
    </Card>
)

export const GuessInput = ({ experiment, userGuess, onSubmit }) => {
    const [value, setValue] = useState(
        userGuess || (experiment.utfallMin + experiment.utfallMax) / 2
    )

    return (
        <Card variant="transparent" sx={{ mx: 'auto', mt: 4, p: 3 }}>
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
                    value={value}
                    onChange={(e, val) => setValue(val)}
                    min={experiment.utfallMin}
                    max={experiment.utfallMax}
                    valueLabelDisplay="on"
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                    }}
                >
                    <Typography>{experiment.utfallMin}</Typography>
                    <Typography>{experiment.utfallMax}</Typography>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => onSubmit(value)}
                    disabled={userGuess}
                    sx={{ mt: 2 }}
                >
                    {userGuess ? 'Svar sendt!' : 'Send svar'}
                </Button>
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
