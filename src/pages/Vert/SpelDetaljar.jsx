import { useState } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    ButtonGroup,
} from '@mui/material'
import QRCode from 'react-qr-code'
import { gameService } from '../../service/gameService.js'
import { SPEL_STATUS } from '../../lib/types.js'

export function SpelDetaljar({ spel, spelId }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [deltakarEmail, setDeltakarEmail] = useState('')
    const [error, setError] = useState('')
    const { route } = useLocation()

    if (!spel) return null
    const status = SPEL_STATUS[spel.status]

    const handleStatusChange = async newStatus => {
        await gameService.updateGameStatus(spelId, newStatus)
    }

    const handleAddDeltakar = async () => {
        try {
            const deltakar = await gameService.findUserByEmail(deltakarEmail)
            console.log('deltakar by email', deltakar)
            if (deltakar) {
                await gameService.updateGame(spelId, {
                    deltakarId: deltakar.id,
                    deltakarEmail: deltakar.email,
                })
                setOpenDialog(false)
            } else {
                setError('Fant ikke bruker med denne e-postadressen')
            }
        } catch (err) {
            console.warn(err)
            setError(err.message)
        }
    }

    return (
        <>
            <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
                <CardHeader
                    title={spel.namn}
                    subheader={spel.dato}
                    sx={{
                        '& .MuiCardHeader-title': {textAlign: '-webkit-auto', marginTop: '-4px'},
                        '& .MuiCardHeader-subheader': {textAlign: '-webkit-auto',}
                    }}
                    action={
                        <Chip label={status.description}
                        sx={(theme) => ({
                            color: theme.palette.getContrastText(status.color),
                            bgcolor:
                                spel.status ===
                                status.value
                                ? status.color
                                : 'inherit'})} />
                    }
                />
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        QR-kode for deltakarar:
                    </Typography>
                    <QRCode
                        value={`${window.location.origin}/spel/${spelId}`}
                        size={200}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={() => route(`/vert/spel/${spelId}/flow`)}
                    sx={{ mt: 2 }}
                >
                    Start gjennomføring
                </Button>

                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            {spel.deltakarId ? (
                                <Box sx={{ fontWeight: 'bold' }}>
                                    {spel.deltakarEmail}
                                </Box>
                            ) : (
                                <Box>'-ingen deltakar-'</Box>
                            )}
                            <Button
                                variant="outlined"
                                onClick={() => setOpenDialog(true)}
                                sx={{ margin: '10px' }}
                            >
                                {!spel.deltakarId
                                    ? 'Legg til deltakar'
                                    : 'Bytt deltakar'}
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <ButtonGroup size="small">
                                {Object.entries(SPEL_STATUS).map(
                                    ([key, status]) => (
                                        <Button
                                            key={key}
                                            onClick={() => {
                                                if (spel.status === status.value) {
                                                    return}
                                                handleStatusChange(status.value)
                                            }}
                                            disabled={
                                                spel.status === status.value
                                            }
                                            sx={(theme) => ({
                                                color:
                                                    spel.status === status.value
                                                        ? theme.palette.getContrastText(status.color)
                                                        : status.color,
                                                bgcolor:
                                                    spel.status === status.value
                                                        ? status.color
                                                        : 'inherit',
                                                '&:hover': {
                                                    //bgcolor: status.color,
                                                    color: 'white',
                                                },
                                                '&.Mui-disabled': {
                                                    bgcolor: status.color,
                                                    color: theme.palette.getContrastText(status.color),
                                                },
                                            })}
                                        >
                                            {status.description}
                                        </Button>
                                    )
                                )}
                            </ButtonGroup>
                        </Box>
                        <Typography variant="body2" color="vert.dark">
                            Opprettet:{' '}
                            {new Date(
                                spel.createdAt?.seconds * 1000
                            ).toLocaleString('no')}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Legg til deltakar</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="E-post"
                        type="email"
                        value={deltakarEmail}
                        onChange={e => setDeltakarEmail(e.target.value)}
                        error={!!error}
                        helperText={error}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Avbryt</Button>
                    <Button onClick={handleAddDeltakar} variant="contained">
                        {spel.deltakarId ? 'Bytt til denne' : 'Legg til'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
