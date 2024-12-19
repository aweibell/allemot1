import { List, ListItem, Typography, Chip } from '@mui/material'

export function SpelList({ spel }) {
    return (
        <List sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
            {spel.map(game => (
                <ListItem
                    key={game.id}
                    component="a"
                    href={`/vert/spel/${game.id}`}
                    sx={{
                        mb: 2,
                        p: 2,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
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
                                color={
                                    game.status === 'oppretta'
                                        ? 'primary'
                                        : 'success'
                                }
                                onClick={e => e.preventDefault()}
                            />
                        </div>
                        <Typography color="text.secondary">
                            {game.dato}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {game.deltakarId
                                ? `Deltakar: ${game.deltakarEmail}`
                                : 'Ingen deltakar valgt'}
                        </Typography>
                    </div>
                </ListItem>
            ))}
        </List>
    )
}
