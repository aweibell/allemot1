import { useEffect, useState } from 'preact/hooks'
import {
    Button,
    Card,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material'
import { EksperimentDialog } from '../../components/EksperimentDialog.jsx'
import { useRoute } from 'preact-iso'
import { SpelDetaljar } from './SpelDetaljar.jsx'
import { gameService } from '../../service/gameService.js'
import { EXPERIMENT_STATUS } from '../../lib/types.js'

export const ExperimentList = ({
    experiments,
    currentIndex,
    onSelectExperiment,
}) => {
    console.log('ExperimentList', experiments)
    return (
        <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Sett opp eksperimenter</Typography>
            <List>
                {experiments.map((exp, index) => (
                    <ListItem
                        key={exp.id}
                        sx={{
                            backgroundColor:
                                index === currentIndex
                                    ? 'darkmagenta'
                                    : 'inherit',
                            color: index === currentIndex ? 'white' : 'inherit',
                        }}
                        button
                        selected={index === currentIndex}
                        onClick={() => onSelectExperiment(exp.id)}
                    >
                        <ListItemText
                            primary={exp.title}
                            secondary={
                                EXPERIMENT_STATUS[exp.status]?.description
                            }
                            sx={{
                                '& .MuiListItemText-secondary': {
                                    color: EXPERIMENT_STATUS[exp.status]?.color,
                                },
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Card>
    )
}

export const SpelVert = () => {
    const { params } = useRoute()
    const [openExperimentDialog, setOpenExperimentDialog] = useState(false)
    const [experiments, setExperiments] = useState([])
    const [spel, setSpel] = useState()
    const [selectedExperimentId, setSelectedExperimentId] = useState()

    useEffect(() => {
        return gameService.listenToGame(params.spelId, setSpel)
    }, [params.spelId])

    useEffect(() => {
        const loadExperiments = async () => {
            const data = await gameService.getExperiments(params.spelId)
            setExperiments(data)
        }
        loadExperiments()
    }, [params.spelId])

    useEffect(() => {
        console.log('spel updated', spel)
    }, [spel])

    useEffect(() => {
        console.log('experiments updated', experiments)
    }, [experiments])

    return (
        <div className="space-y-4">
            <SpelDetaljar spel={spel} spelId={params.spelId} />
            <Button onClick={() => setOpenExperimentDialog(true)}>
                Legg til eksperiment
            </Button>

            <ExperimentList
                experiments={experiments}
                activeId={spel?.activeExperimentId}
                onStatusChange={(expId, status) =>
                    gameService.updateExperimentStatus(
                        params.spelId,
                        expId,
                        status
                    )
                }
                onSelectExperiment={id => {
                    setSelectedExperimentId(id)
                    setOpenExperimentDialog(true)
                }}
            />

            <EksperimentDialog
                open={openExperimentDialog}
                onClose={() => setOpenExperimentDialog(false)}
                spelId={params.spelId}
                experiment={experiments.find(
                    e => e.id === selectedExperimentId
                )}
            />
        </div>
    )
}
// const ExperimentCard = ({ experiment, isActive, onStatusChange }) => {
//     const nextStatus = {
//         [EXPERIMENT_STATUS.OPPRETTA.value]: EXPERIMENT_STATUS.NESTE.value,
//         [EXPERIMENT_STATUS.NESTE.value]: EXPERIMENT_STATUS.PRESENTERT.value,
//         [EXPERIMENT_STATUS.PRESENTERT.value]: EXPERIMENT_STATUS.STEMMING.value,
//         [EXPERIMENT_STATUS.STEMMING.value]: EXPERIMENT_STATUS.LUKKA.value,
//         [EXPERIMENT_STATUS.LUKKA.value]: EXPERIMENT_STATUS.SVAR_LAAST.value,
//         [EXPERIMENT_STATUS.SVAR_LAAST.value]: EXPERIMENT_STATUS.RESULTAT.value,
//         [EXPERIMENT_STATUS.RESULTAT.value]: EXPERIMENT_STATUS.FERDIG.value,
//     }
//
//     return (
//         <Card className={`experiment-card ${isActive ? 'active' : ''}`}>
//             <CardContent>
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <Typography variant="h6">{experiment.title}</Typography>
//                         <Typography color="textSecondary">
//                             {EXPERIMENT_STATUS[experiment.status].description}
//                         </Typography>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button
//                             disabled={
//                                 !isActive || !nextStatus[experiment.status]
//                             }
//                             onClick={() =>
//                                 onStatusChange(nextStatus[experiment.status])
//                             }
//                         >
//                             Neste steg
//                         </Button>
//                         {experiment.status ===
//                             EXPERIMENT_STATUS.OPPRETTA.value && (
//                             <Button
//                                 onClick={() =>
//                                     onStatusChange(
//                                         EXPERIMENT_STATUS.KLARGJORT.value
//                                     )
//                                 }
//                             >
//                                 Klargjør
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
