import { useEffect, useState } from 'preact/hooks'
import { gameService } from '../../service/gameService.js'
import { EXPERIMENT_STATUS, SPEL_STATUS } from '../../lib/types.js'
import {
    GuessInput,
    PresentExperiment,
    QuoteScreen,
    ReadyScreen,
    WaitingScreen,
    WelcomeScreen,
} from './PlayerGameFlowComponents.jsx'
import { Paper } from '@mui/material'
import { useAuth } from '../../service/firebaseService.js'
import { ResultDisplay } from '../../components/ResultDisplay.jsx'

export const PlayerGameFlow = ({ spelId, isDeltakar }) => {
    const [spel, setSpel] = useState(null)
    const [activeExperiment, setActiveExperiment] = useState(null)
    const [userGuess, setUserGuess] = useState(null)
    const { user } = useAuth()
    const [resultatData, setResultatData] = useState()
    console.log(
        'activeExperiment',
        activeExperiment?.title,
        activeExperiment?.status
    )
    console.log('spel.status', spel?.status)

    useEffect(() => {
        return gameService.listenToGame(spelId, setSpel)
    }, [spelId])

    useEffect(() => {
        if (
            !spel ||
            ![SPEL_STATUS.KLARGJORT.value, SPEL_STATUS.IGANG.value].includes(
                spel.status
            )
        )
            return
        return gameService.listenToActiveExperiment(spelId, setActiveExperiment)
    }, [spelId, spel?.status])

    useEffect(() => {
        if (!spelId || !activeExperiment?.id) return
        const getResults = async () => {
            const resultData = await gameService.getResultData(
                spelId,
                activeExperiment.id
            )
            console.log('got resultData', resultData)
            setResultatData(resultData)
        }
        getResults()
    }, [spelId, activeExperiment?.id])

    const renderContent = () => {
        if (!spel) return <WaitingScreen message={'Fann ikkje spelet'} />

        if (!activeExperiment) {
            return <WelcomeScreen spel={spel} isDeltakar={isDeltakar} />
        }

        switch (activeExperiment.status) {
            case EXPERIMENT_STATUS.NESTE.value:
                return <ReadyScreen /> //  experiment={activeExperiment} />
            case EXPERIMENT_STATUS.PRESENTERT.value:
                setUserGuess(undefined)
                return <PresentExperiment experiment={activeExperiment} />
            case EXPERIMENT_STATUS.STEMMING.value:
                return userGuess ? (
                    <WaitingScreen message={`Du gjetta ${userGuess}`} />
                ) : (
                    <GuessInput
                        experiment={activeExperiment}
                        onSubmit={value => {
                            console.log('submitting value', value)
                            const gs = value
                            gameService
                                .submitGuess(
                                    spelId,
                                    activeExperiment.id,
                                    user.uid,
                                    value
                                )
                                .then(result => {
                                    console.log('submitted with result', result)
                                    setUserGuess(gs)
                                })
                        }}
                    />
                )
            case EXPERIMENT_STATUS.LUKKA.value:
            case EXPERIMENT_STATUS.SVAR_LAAST.value:
                return <PresentExperiment experiment={activeExperiment} />
            case EXPERIMENT_STATUS.RESULTAT.value:
                return (
                    <ResultDisplay
                        spelId={spelId}
                        result={resultatData?.result}
                        deltakarGuess={resultatData?.deltakarGuess}
                        experiment={activeExperiment}
                        userGuess={userGuess}
                        showAverage={false}
                    />
                )
            case EXPERIMENT_STATUS.FERDIG.value:
                return (
                    <ResultDisplay
                        spelId={spelId}
                        result={resultatData?.result}
                        deltakarGuess={resultatData?.deltakarGuess}
                        experiment={activeExperiment}
                        userGuess={userGuess}
                        average={resultatData?.audienceAverage}
                        showAverage={true}
                    />
                )
            default:
                return <QuoteScreen experiment={activeExperiment} />
        }
    }

    return (
        <Paper
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
            }}
        >
            {renderContent()}
        </Paper>
    )
}
