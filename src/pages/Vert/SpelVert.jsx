import { useEffect, useState } from 'preact/hooks'
import {
    Button,
    Card,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { EksperimentDialog } from '../../components/EksperimentDialog.jsx'
import { useRoute } from 'preact-iso'
import { SpelDetaljar } from './SpelDetaljar.jsx'
import { gameService } from '../../service/gameService.js'
import { EXPERIMENT_STATUS } from '../../lib/types.js'

// Keep this as a separate component
export const ExperimentList = ({
    experiments,
    currentIndex,
    onSelectExperiment,
    onEditExperiment,
}) => {
    return (
        <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Eksperiment</Typography>
            <List sx={{display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                {experiments.map((exp, index) => (
                    <ListItem
                        key={exp.id}
                        sx={{
                            borderRadius: '0.5rem',
                            backgroundColor:
                                index === currentIndex
                                    ? 'darkmagenta'
                                    : 'inherit',
                            color: index === currentIndex ? 'white' : 'inherit',
                            '&:hover': {
                                bgcolor: 'background.elevation4',
                            },
                            cursor: 'pointer'
                        }}
                        onClick={() => onSelectExperiment(exp.id)}
                        secondaryAction={
                            typeof onEditExperiment === 'function' && (
                                <IconButton 
                                    edge="end" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditExperiment(exp.id);
                                    }}
                                    sx={{ color: 'white' }}
                                >
                                    <EditIcon />
                                </IconButton>
                            )
                        }
                    >
                        <ListItemText
                            primary={index + 1 + '. ' + exp.title}
                            secondary={EXPERIMENT_STATUS[exp.status]?.description}
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

    const handleEditExperiment = (expId) => {
        setSelectedExperimentId(expId)
        setOpenExperimentDialog(true)
    }

    return (
        <div className="space-y-4">
            <SpelDetaljar spel={spel} spelId={params.spelId} />
            <Button onClick={() => {
                setSelectedExperimentId(null)
                setOpenExperimentDialog(true)
            }}>
                Legg til eksperiment
            </Button>

            <ExperimentList
                experiments={experiments}
                currentIndex={experiments?.findIndex(e => e.id === spel?.activeExperimentId)}
                onSelectExperiment={() => {}} // No-op for SpelVert
                onEditExperiment={handleEditExperiment}
            />

            <EksperimentDialog
                open={openExperimentDialog}
                onClose={() => {
                    setOpenExperimentDialog(false)
                    setSelectedExperimentId(null)
                }}
                spelId={params.spelId}
                experiment={experiments.find(e => e.id === selectedExperimentId)}
                isEditing={!!selectedExperimentId}
            />
        </div>
    )
}
