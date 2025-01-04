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
                        sx={(theme) => ({
                            color:
                                spel?.status === status.value
                                    ? theme.palette.getContrastText(status.color)
                                    : status.color,
                            bgcolor:
                                spel?.status === status.value
                                    ? status.color
                                    : 'inherit',
                            '&:hover': {
                                color: 'white',
                            },
                            '&.Mui-disabled': {
                                bgcolor: status.color,
                                color: theme.palette.getContrastText(status.color),
                            }
                        })}
                    >
                        {status.description}
                    </Button>
                ))}
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography>
                    {`${window.location.origin}/spel/${spelId}`}
                </Typography>
                <Typography>
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
