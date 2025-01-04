import styled from '@emotion/styled'
import { List, ListItem, Typography, Chip, colors } from '@mui/material'
import { SPEL_STATUS } from '../lib/types'

export function SpelList({ spel }) {
    return (
        <List sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
            {spel.map(game => (
                <ListItem
                    key={game.id}
                    component="a"
                    href={`/vert/spel/${game.id}`}
                    sx={(theme) => ({
                        border: 'solid thin',
                        borderColor: theme.palette.background.elevation3,
                        borderRadius: '0.5rem',
                        bgcolor: 'background.elevation1',
                        mb: 2,
                        p: 2,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    })}
                >
                    <div style={{ width: '100%' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6">{game.namn}</Typography>
                            <Chip
                                label={game.status}
                                sx={(theme) => ({
                                        color: theme.palette.getContrastText(SPEL_STATUS[game.status].color),
                                        bgcolor: SPEL_STATUS[game.status].color,
                                    })
                                }
                                onClick={e => e.preventDefault()}
                            />
                        </div>
                        <Typography color="vert.dark">
                            {game.dato}
                        </Typography>
                        <div>
                            <Typography variant="body2" component={"span"} sx={{color:"vert.dark"}}>
                                Deltakar:
                            </Typography>
                            <Typography component={"span"} color="deltakar.main">
                            {game.deltakarId
                                    ? ` ${game.deltakarEmail}`
                                    : ' Ingen deltakar valgt'}
                            </Typography>
                        </div>
                    </div>
                </ListItem>
            ))}
        </List>
    )
}
