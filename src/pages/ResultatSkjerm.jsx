import { ResultDisplay } from '../components/ResultDisplay.jsx'
import { useEffect, useState } from 'preact/hooks'
import { gameService } from '../service/gameService.js'
import { EXPERIMENT_STATUS, SPEL_STATUS } from '../lib/types.js'
import {
    WaitingScreen,
    WelcomeScreen,
} from './Deltakar/PlayerGameFlowComponents.jsx'
import { Container } from '@mui/material'

export const ResultatSkjerm = ({ spelId }) => {
    const [activeExperiment, setActiveExperiment] = useState(null)
    const [spel, setSpel] = useState(null)
    const [resultatData, setResultatData] = useState({})
    const [showResult, setShowResult] = useState(false)
    const [showAverage, setShowAverage] = useState(false)

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
            setResultatData(resultData)
        }
        getResults()
    }, [spelId, activeExperiment?.id])

    useEffect(() => {
        setShowAverage(
            activeExperiment.status === EXPERIMENT_STATUS.FERDIG.value
        )
        setShowResult(
             [EXPERIMENT_STATUS.FERDIG.value, EXPERIMENT_STATUS.RESULTAT.value, EXPERIMENT_STATUS.AVSLUTTA.value].includes(activeExperiment.status)
        )
    }, [activeExperiment?.status])

    if (!spel) return <WaitingScreen message={'Fann ikkje spelet'} />

    if (!activeExperiment) {
        return <WelcomeScreen spel={spel} isDeltakar={false} />
    }
    return (
        <Container>
            <ResultDisplay
                spelId={spelId}
                result={showResult ? resultatData.result : null}
                deltakarGuess={resultatData.deltakarGuess}
                experiment={activeExperiment}
                average={resultatData.audienceAverage}
                showAverage={showAverage}
            />
        </Container>
    )
}
