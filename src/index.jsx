import { render } from 'preact'
import { useEffect } from 'preact/hooks'
import { LocationProvider, Route, Router, useLocation } from 'preact-iso'
import { Container, ThemeProvider } from '@mui/material'
import { Header } from './components/Header.jsx'
import { Publikum } from './pages/Publikum/Publikum.jsx'
import GameParticipant from './pages/Deltakar/Deltakar.jsx'
import { Profil } from './pages/Login/Profil.jsx'
import { Vert } from './pages/Vert/Vert.jsx'
import { NotFound } from './pages/_404.jsx'
import './style.css'
import { getConnectionState, useAuth } from './service/firebaseService.js'
import MultiLogin from './pages/Login/MultiLogin.jsx'
import { SuperAdminPage } from './pages/Admin/SuperAdminPage.jsx'
import { LogoutPage } from './pages/Loggut.jsx'
import { SpelVert } from './pages/Vert/SpelVert.jsx'
import { PlayerGameFlow } from './pages/Deltakar/GameFlow.jsx'
import { VertGameFlow } from './pages/Vert/VertGameFlow.jsx'
import { ResultatSkjerm } from './pages/ResultatSkjerm.jsx'
import { allemot1Theme } from './muiTheme.js'

console.log('rendering App')

export function App() {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading..</div>
    }
    if (!user) {
        console.log('returning Login component')
        return (
            <div>
                <MultiLogin />
            </div>
        )
    }
    const isConnected = getConnectionState() === 'connected'
    console.log('isConnected?', isConnected)
    const connectionWarning = loading || !isConnected
    return (
        <ThemeProvider theme={allemot1Theme}>
            <Container
                sx={{
                    height: '100%',
                    border: connectionWarning ? 'solid red 3px' : 'none',
                    padding: connectionWarning ? '2px' : '0',
                    margin: connectionWarning ? '2px' : '0',
                }}
            >
                <LocationProvider>
                    <Header />
                    <main style={{ height: '100%' }}>
                        <Router>
                            <RoutingDebugger />
                            <Route
                                path="/resultat/:spelId"
                                component={ResultatSkjerm}
                            />
                            <Route path="/" component={Publikum} />
                            <Route
                                path="/deltakar/:spelkode/"
                                component={GameParticipant}
                            />
                            <Route path="/profil/" component={Profil} />
                            <Route path="/admin" component={SuperAdminPage} />
                            <Route path="/vert/" component={Vert} />
                            <Route
                                path="/vert/spel/:spelId"
                                component={SpelVert}
                            />
                            <Route
                                path="/vert/spel/:spelId/flow"
                                component={VertGameFlow}
                            />
                            <Route
                                path="/spel/:spelId"
                                component={PlayerGameFlow}
                            />
                            <Route path="/loggut/" component={LogoutPage} />
                            <Route default component={NotFound} />
                        </Router>
                    </main>
                </LocationProvider>
            </Container>
        </ThemeProvider>
    )
}

function RoutingDebugger() {
    const { path, route, params } = useLocation()
    console.log('RoutingDebugger', 'color: red; font-weight: bold')
    useEffect(() => {
        console.log(
            '%cRoute changed:',
            'background-color: red; color: white; padding: 3px;',
            {
                path,
                route,
                params,
            }
        )
    }, [path, route, params])
    return null
}

render(<App />, document.getElementById('app'))
