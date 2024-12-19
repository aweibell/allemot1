import { Box, Button, Card, Typography } from '@mui/material'
import { SPEL_STATUS } from '../lib/types.js'
import { gameService } from '../service/gameService.js'
import { useLocation } from 'preact-iso'

export const GameStatus = ({ spelId, spel }) => {
    const { route } = useLocation()

    return (
        <Card sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6">
                Status: {SPEL_STATUS[spel?.status]?.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {Object.entries(SPEL_STATUS).map(([key, status]) => (
                    <Button
                        key={key}
                        variant={
                            spel?.status === status.value
                                ? 'contained'
                                : 'outlined'
                        }
                        onClick={() =>
                            gameService.updateGameStatus(spelId, status.value)
                        }
                        disabled={spel?.status === status.value}
                        sx={{
                            color:
                                spel?.status === status.value
                                    ? 'white'
                                    : status.color,
                            bgcolor:
                                spel?.status === status.value
                                    ? status.color
                                    : 'transparent',
                            '&:hover': {
                                bgcolor: status.color,
                                color: 'white',
                            },
                        }}
                    >
                        {status.description}
                    </Button>
                ))}
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography
                    color="primary"
                    onClick={() =>
                        route(`${window.location.origin}/spel/${spelId}`)
                    }
                >
                    {`${window.location.origin}/spel/${spelId}`}
                </Typography>
                <Typography
                    onClick={() =>
                        route(`${window.location.origin}/resultat/${spelId}`)
                    }
                >
                    {`${window.location.origin}/resultat/${spelId}`}
                </Typography>
                {/*<Typography>Deltakelser: {stats.totalGuesses}</Typography>*/}
                {/*<Typography>*/}
                {/*    Gjennomsnitt: {stats.avgGuess?.toFixed(1)}*/}
                {/*</Typography>*/}
            </Box>
        </Card>
    )
}
