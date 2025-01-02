import { render } from 'preact'
import { useEffect } from 'preact/hooks'
import { LocationProvider, Route, Router, useLocation } from 'preact-iso'
import { Container, ThemeProvider } from '@mui/material'
import { Header } from './components/Header.jsx'
import { Publikum } from './pages/Publikum/Publikum.jsx'
import GameParticipant from './pages/Deltakar/Deltakar.jsx'
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
import { WelcomePage } from './pages/WelcomePage.jsx'

console.log('rendering App')

export function App() {
    const { user, loading } = useAuth()
    const isConnected = getConnectionState() === 'connected'
    
    // Only show warning if we're still loading or explicitly disconnected
    // Don't show warning during the initial 'unknown' state
    const connectionWarning = !loading && getConnectionState() === 'disconnected'

    if (loading) {
        return <div>Loading..</div>
    }

    // Separate routing for unauthenticated users
    if (!user) {
        console.log('returning Login component since no user', user)
        return (
            <ThemeProvider theme={allemot1Theme}>
                <Container
                    sx={{
                        minHeight: '100vh',
                        bgcolor: 'grey.100',
                        p: 0,
                        border: connectionWarning ? 'solid red 3px' : 'none',
                        padding: connectionWarning ? '2px' : '0',
                        margin: connectionWarning ? '2px' : '0',
                    }}
                >
                    <LocationProvider>
                        <RoutingDebugger /> 
                        <Router>
                            <Route path="/" component={WelcomePage} />
                            <Route path="/login" component={MultiLogin} />
                            <Route path="/spel/:spelId" component={PlayerGameFlow} />
                            <Route default component={WelcomePage} />
                        </Router>
                    </LocationProvider>
                </Container>
            </ThemeProvider>
        )
    }

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
                    <RoutingDebugger /> 
                    <Header />
                    <main style={{ height: '100%' }}>
                        <Router>
                            <Route path="/" component={() => {
                                console.log('%cRoot route rendered', 'color: orange; font-weight: bold');
                                return <Publikum />;
                            }} />
                            <Route
                                path="/resultat/:spelId"
                                component={ResultatSkjerm}
                            />
                            <Route
                                path="/deltakar/:spelkode/"
                                component={GameParticipant}
                            />
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
                            <Route path="/login/" component={MultiLogin} />
                            <Route path="/loggut/" component={LogoutPage} />
                            <Route default component={() => {
                                console.log('%cDefault route rendered', 'color: orange; font-weight: bold');
                                return <NotFound />;
                            }} />
                        </Router>
                    </main>
                </LocationProvider>
            </Container>
        </ThemeProvider>
    )
}

function RoutingDebugger() {
    const { path } = useLocation()
    console.log('%cRoutingDebugger', 'color: red; font-weight: bold')
    useEffect(() => {
        console.log(
            '%cRoute changed:',
            'background-color: red; color: white; padding: 3px;',
                '['+path+']',
        )
    }, [path ])
    return null
}

render(<App />, document.getElementById('app'))
