// SuperAdmin page component for managing vert roles
import { useEffect, useState } from 'preact/hooks'
import {
    findUserByEmail,
    getAllSpel,
    grantVertPrivilege,
    subscribeToEmailUsers,
} from '../../service/superAdminDbService.js'
import {
    Alert,
    Box,
    Button,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import {
    PersonAdd as PersonAddIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material'

export const SuperAdminPage = () => {
    const [users, setUsers] = useState([])
    const [alleSpel, setAlleSpel] = useState(undefined)
    const [newVertEmail, setNewVertEmail] = useState('')
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        const unsubscribe = subscribeToEmailUsers(setUsers)
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        async function getSpel() {
            const spel = await getAllSpel()
            setAlleSpel(spel)
        }
        getSpel()
    }, [])

    const handleGrantVertRole = async targetUserId => {
        try {
            const result = await grantVertPrivilege(targetUserId)
            console.log('grantVertPrivilege result', result)
            setMessage({
                type: 'success',
                text: 'Vert-rolle tildelt',
            })
            setNewVertEmail('')
            // Update local state
            // setUsers(
            //     users.map(user =>
            //         user.id === targetUserId
            //             ? { ...user, canBeVert: true }
            //             : user
            //     )
            // )
        } catch (error) {
            console.error('grantVertPrivilege failed:', error)
            setMessage({
                type: 'error',
                text: 'Kunne ikke tildele vert-rolle',
            })
        }
    }

    const handleAddNewVert = async () => {
        try {
            const user = await findUserByEmail(newVertEmail)
            if (!user) {
                setMessage({
                    type: 'error',
                    text: 'Fant ikke bruker med denne e-postadressen',
                })
                return
            }
            await handleGrantVertRole(user.id)
            setNewVertEmail('')
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Kunne ikke legge til ny vert',
            })
        }
    }

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Administrer verter
            </Typography>

            <Paper sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="E-post for ny vert"
                        value={newVertEmail}
                        onChange={e => setNewVertEmail(e.target.value)}
                        fullWidth
                    />
                    <Button
                        sx={{width:'9.6rem'}}
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleAddNewVert}
                        disabled={!newVertEmail}
                    >
                        Legg til
                    </Button>
                </Box>
            </Paper>
            <Paper>
                <Box sx={{borderRadius:0, border:0, padding:0}}>
                    {Array.isArray(alleSpel) ? (
                        <Typography sx={{padding: '0.5rem'}}>
                            {' '}
                            Totalt er det oppretta {alleSpel.length} spel
                        </Typography>
                    ) : (
                        <Typography>
                            (Har ikkje fått tak i lista over spel)
                        </Typography>
                    )}
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>E-post</TableCell>
                            <TableCell>Nickname</TableCell>
                            <TableCell align="right">Vert status</TableCell>
                            <TableCell align="right">Handling</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell align="right">
                                    {user.canBeVert ? (
                                        <CheckIcon color="success" />
                                    ) : (
                                        <CloseIcon color="error" />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {!user.canBeVert && (
                                        <IconButton
                                            onClick={() =>
                                                handleGrantVertRole(user.id)
                                            }
                                            color="primary"
                                        >
                                            <PersonAddIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={() => setMessage({ type: '', text: '' })}
            >
                <Alert
                    severity={message.type}
                    onClose={() => setMessage({ type: '', text: '' })}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    )
}
