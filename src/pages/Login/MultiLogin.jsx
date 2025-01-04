import { useState } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInAnonymously,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../../service/firebaseService.js'
import {
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    CircularProgress,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
} from '@mui/material'

const Login = () => {
    const { route } = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetSuccess, setResetSuccess] = useState(false)

    // Get redirect URL from query parameters
    const searchParams = new URLSearchParams(window.location.search)
    const redirectUrl = searchParams.get('redirect') || '/'

    const handleEmailAuth = async e => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password)
            } else {
                await signInWithEmailAndPassword(auth, email, password)
            }
            // Redirect after successful login
            route(redirectUrl)
        } catch (err) {
            setError(err.message)
        }

        setLoading(false)
    }

    const handleAnonymousAuth = async () => {
        setLoading(true)
        setError('')

        try {
            await signInAnonymously(auth)
            // Redirect after successful login
            route(redirectUrl)
        } catch (err) {
            setError(err.message)
        }

        setLoading(false)
    }

    const handleResetPassword = async () => {
        setLoading(true)
        setError('')

        try {
            await sendPasswordResetEmail(auth, resetEmail)
            setResetSuccess(true)
            setResetDialogOpen(false)
        } catch (err) {
            setError(err.message)
        }

        setLoading(false)
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    display: 'grid',
                    flexDirection: 'flex',
                    gap: 0,
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    align="center"
                    gutterBottom
                >
                    {isSignUp ? 'Opprett konto' : 'Login'}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Button
                    sx={{gap:0}}
                    variant="outlined"
                    fullWidth
                    onClick={handleAnonymousAuth}
                    disabled={loading}
                >
                    Hald fram som gjest
                </Button>
                <Typography sx={{marginBottom:'0.5rem', gap:0, justifySelf: 'center', fontSize:'0.8rem'}}>(Det fungerer heilt fint for ein kveld)</Typography>
                <Divider sx={{ my: 2 }}>eller</Divider>
                <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Epost"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        margin="normal"
                        required
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Passord"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        margin="normal"
                        required
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : isSignUp ? (
                            'Opprett brukar'
                        ) : (
                            'Logg inn'
                        )}
                    </Button>
                </form>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Button
                        variant="text"
                        onClick={() => setIsSignUp(!isSignUp)}
                        disabled={loading}
                    >
                        {isSignUp
                            ? 'Har du oppretta ein brukar?'
                            : 'Har ikkje brukar?'}
                    </Button>

                    {!isSignUp && (
                        <Button
                            variant="text"
                            onClick={() => setResetDialogOpen(true)}
                            disabled={loading}
                        >
                            Hugsar ikkje passordet?
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* Password Reset Dialog */}
            <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
            >
                <DialogTitle>Sett nytt passord</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Epost-adresse"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetDialogOpen(false)}>
                        Avbryt
                    </Button>
                    <Button onClick={handleResetPassword} disabled={loading}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Send Lenke for å setja nytt passord'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Message */}
            <Snackbar
                open={resetSuccess}
                autoHideDuration={6000}
                onClose={() => setResetSuccess(false)}
                message="Password reset email sent!"
            />
        </Box>
    )
}

export default Login
