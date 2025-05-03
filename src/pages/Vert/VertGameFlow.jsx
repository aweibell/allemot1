import { useEffect, useState } from 'preact/hooks'
import { gameService } from '../../service/gameService.js'
import { EXPERIMENT_STATUS } from '../../lib/types.js'
import { Box, Card, List, ListItemButton, Typography } from '@mui/material'
import { GameStatus } from '../../components/GameStatus.jsx'
import { ExperimentDetailView } from '../../components/ExperimentGameDetailView.jsx'
import { ExperimentList } from './SpelVert.jsx'
import { ResultInput } from '../../components/ResultInput.jsx'

export const VertGameFlow = ({ spelId }) => {
    const [experiments, setExperiments] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [spel, setSpel] = useState(null)

    useEffect(() => {
        return gameService.listenToExperiments(spelId, setExperiments)
    }, [spelId])

    useEffect(() => {
        return gameService.listenToGame(spelId, setSpel)
    }, [spelId])

    useEffect(() => {
        const handleKeyPress = e => {
            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault()
                    handleNextState()
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    handlePrevState()
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    handleNextExperiment()
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    handlePrevExperiment()
                    break
            }
        }
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [currentIndex, experiments])

    const currentExperiment = experiments[currentIndex]
    const expStates = Object.values(EXPERIMENT_STATUS)

    const selectExperimentById = expIdToSelect => {
        const newExpIndex = experiments.findIndex(ex => ex.id === expIdToSelect)
        setCurrentIndex(newExpIndex)
    }
    const handleExpStateChange = async newStatus => {
        await gameService.updateExperimentStatus(
            spelId,
            currentExperiment.id,
            newStatus
        )
    }

    const handleNextState = () => {
        const currentStateIndex = expStates.findIndex(
            s => s.value === currentExperiment.status
        )
        if (currentStateIndex < expStates.length - 1) {
            handleExpStateChange(expStates[currentStateIndex + 1].value)
        }
    }

    const handlePrevState = () => {
        const currentStateIndex = expStates.findIndex(
            s => s.value === currentExperiment.status
        )
        if (currentStateIndex > 0) {
            handleExpStateChange(expStates[currentStateIndex - 1].value)
        }
    }

    const handleNextExperiment = () => {
        if (currentIndex < experiments.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const handlePrevExperiment = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    return (
        <Box sx={{ p: 2 }}>
            <GameStatus
                spelId={spelId}
                spel={spel}
                eksperiments={experiments}
            />
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <ExperimentList
                        experiments={experiments}
                        currentIndex={currentIndex}
                        onSelectExperiment={selectExperimentById}
                    />
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Status
                        </Typography>
                        <List
                            color="primary"
                            orientation="vertical"
                            sx={{ width: '100%' }}
                        >
                            {Object.values(EXPERIMENT_STATUS).map(state => {
                                const isActive =
                                    state.value === currentExperiment?.status
                                return (
                                    <ListItemButton
                                        key={state.value}
                                        variant="eksperimentStatus"
                                        color="secondary"
                                        selected={isActive}
                                        onClick={() =>
                                            handleExpStateChange(state.value)
                                        }
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2,
                                        }}
                                    >
                                        {state.description}
                                    </ListItemButton>
                                )
                            })}
                        </List>
                    </Card>
                </Box>

                <ExperimentDetailView
                    spelId={spelId}
                    experiment={experiments[currentIndex]}
                />
                <ResultInput
                    spelId={spelId}
                    experiment={experiments[currentIndex]}
                />
            </Box>
        </Box>
    )
}

// import { useEffect, useState } from 'preact/hooks'
// import { gameService } from '../../service/gameService.js'
// import { useRoute } from 'preact-iso'
// import { ExperimentList } from './SpelVert.jsx'
// import { GameStatus } from '../../components/GameStatus.jsx'
// import { ExperimentDetailView } from '../../components/ExperimentGameDetailView.jsx'
//
// export const VertGameFlow = () => {
//     const { params } = useRoute()
//     const [spel, setSpel] = useState(null)
//     const [experiments, setExperiments] = useState([])
//     const spelId = params.spelId
//     console.log('%cVertGameFlow', 'border-top: red solid 2px', spelId)
//     console.log('spel', spel)
//     console.log('experiments', experiments)
//
//     useEffect(() => {
//         return gameService.listenToGame(spelId, setSpel)
//     }, [spelId])
//
//     useEffect(() => {
//         if (!spel) return
//         return gameService.listenToExperiments(spelId, setExperiments)
//     }, [spelId, spel])
//
//     return (
//         <div className="vert-container">
//             <GameStatus spel={spel} />
//             <ExperimentList
//                 experiments={experiments}
//                 activeId={spel?.activeExperimentId}
//                 onStatusChange={(expId, status) =>
//                     gameService.updateExperimentStatus(spelId, expId, status)
//                 }
//             />
//             <ExperimentDetailView
//                 experiment={experiments.find(
//                     e => e.id === spel?.activeExperimentId
//                 )}
//                 onShowResult={() => gameService.showExperimentResult(spelId)}
//             />
//         </div>
//     )
// }
