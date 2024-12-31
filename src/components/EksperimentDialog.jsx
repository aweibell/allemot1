import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import { useState, useEffect } from 'preact/hooks'
import { EXPERIMENT_STATUS } from '../lib/types.js'
import { gameService } from '../service/gameService.js'

export const EksperimentDialog = ({
    open,
    onClose,
    spelId,
    experiment,
    isEditing,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        utfallMin: '',
        utfallMax: '',
        image: '',
        quote: '',
        timeFormat: false,
    })

    // Initialize form data when experiment prop changes
    useEffect(() => {
        if (experiment) {
            setFormData({
                title: experiment.title || '',
                description: experiment.description || '',
                utfallMin: experiment.utfallMin !== undefined ? experiment.utfallMin : '',
                utfallMax: experiment.utfallMax !== undefined ? experiment.utfallMax : '',
                image: experiment.image || '',
                quote: experiment.quote || '',
                timeFormat: experiment.timeFormat || false,
            })
        }
    }, [experiment])

    const handleSubmit = async () => {
        const data = {
            ...formData,
            utfallMin: Number(formData.utfallMin),
            utfallMax: Number(formData.utfallMax),
            status: isEditing
                ? experiment.status
                : EXPERIMENT_STATUS.OPPRETTA.value,
        }

        if (isEditing) {
            await gameService.updateExperiment(spelId, experiment.id, data)
        } else {
            await gameService.addExperiment(spelId, data)
        }
        onClose()
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                elevation: 1,
                sx: { bgcolor: 'background.elevation1' }
            }}
        >
            <DialogTitle>
                {isEditing ? 'Rediger eksperiment' : 'Nytt eksperiment'}
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Tittel"
                        value={formData.title}
                        onChange={e =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Beskrivelse"
                        value={formData.description}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Min verdi"
                            value={formData.utfallMin}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    utfallMin: e.target.value,
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            type="number"
                            label="Max verdi"
                            value={formData.utfallMax}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    utfallMax: e.target.value,
                                })
                            }
                        />
                    </Box>
                    <TextField
                        fullWidth
                        label="Bilde URL"
                        value={formData.image}
                        onChange={e =>
                            setFormData({ ...formData, image: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Sitat for venteskjerm"
                        value={formData.quote}
                        onChange={e =>
                            setFormData({ ...formData, quote: e.target.value })
                        }
                        sx={{ mt: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.timeFormat}
                                onChange={(e) => setFormData({ ...formData, timeFormat: e.target.checked })}
                            />
                        }
                        label="Vis verdiar som tid (mm:ss)"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Avbryt</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={
                        !formData.title ||
                        formData.utfallMin === '' ||
                        formData.utfallMax === ''
                    }
                >
                    {isEditing ? 'Lagre' : 'Legg til'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EksperimentDialog
