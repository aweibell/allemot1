import { Button, Container, Typography, Box } from '@mui/material'
import { useLocation } from 'preact-iso'
import allemot1Logo from '../../public/allemot1_logo.png'

export function WelcomePage() {
    console.log('%cWelcomePage', 'color: orange; font-weight: bold')
    const location = useLocation()
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                gap: 4
            }}
        >
            <img
                src={allemot1Logo}
                alt="Alle mot 1-logo"
                style={{ height: '20vw', width: '20vw' }}
            />
            <Typography variant="h3" component="h1">
                Vil du spela Alle mot 1?
            </Typography>
            <Typography variant="h5" >
                Ta kontakt om du vil arrangera eit spel. Du må registrera deg med epost.
            </Typography>
            <Typography variant="h5" >
                Logg inn og få ein spel-kode av ein arrangør for å delta.
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => location.route('/login/')}
                    sx={{ minWidth: 200 }}
                >
                    Logg inn for å spela
                </Button>
            </Box>
        </Container>
    )
} 