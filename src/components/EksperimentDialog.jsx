import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from '@mui/material'
import { useState } from 'preact/hooks'
import { EXPERIMENT_STATUS } from '../lib/types.js'
import { gameService } from '../service/gameService.js'

export const EksperimentDialog = ({
    open,
    onClose,
    spelId,
    experiment,
    isEditing,
}) => {
    console.log('ExperimentDialog spelId', spelId)
    const [formData, setFormData] = useState({
        title: experiment?.title || '',
        description: experiment?.description || '',
        utfallMin:
            experiment?.utfallMin !== undefined ? experiment.utfallMin : '',
        utfallMax:
            experiment?.utfallMax !== undefined ? experiment.utfallMax : '',
        image: experiment?.image || '',
    })

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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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

// Dialog component for adding new experiments
// import {
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     TextField,
//     Box,
//     Alert,
// } from '@mui/material'
// import { useState } from 'react'
// import { db, storage, useAuth } from '../../service/firebaseService.js'
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { addDoc, collection } from 'firebase/firestore'
// import { EXPERIMENT_STATUS } from '../../lib/types.js'
//
// export const NyttEksperimentDialog = ({ open, onClose, spelId }) => {
//     const { user } = useAuth()
//     console.log('spelId', spelId)
//     console.log('user', user)
//     console.log('open', open)
//     console.log('onClose', onClose)
//     const [experimentData, setExperimentData] = useState({
//         title: '',
//         description: '',
//         utfallMin: 0,
//         utfallMax: 1000,
//         image: null,
//     })
//     const [error, setError] = useState('')
//
//     const handleChange = field => event => {
//         const value = event.target.value
//         setExperimentData(prev => {
//             const newData = { ...prev, [field]: value }
//             // Validate min/max when either changes
//             if (field === 'utfallMin' || field === 'utfallMax') {
//                 const min =
//                     field === 'utfallMin'
//                         ? Number(value)
//                         : Number(prev.utfallMin)
//                 const max =
//                     field === 'utfallMax'
//                         ? Number(value)
//                         : Number(prev.utfallMax)
//                 if (min >= max) {
//                     setError('Minimum må være mindre enn maksimum')
//                 } else {
//                     setError('')
//                 }
//             }
//             return newData
//         })
//     }
//
//     // In your component
//     const handleImageUpload = async event => {
//         if (!user || !user.isAnonymous) {
//             // Only allow authenticated users
//             const file = event.target.files[0]
//             if (file) {
//                 const storageRef = ref(
//                     storage,
//                     `eksperiment-images/${spelId}/${file.name}`
//                 )
//                 console.log('lastar opp til storageRef', storageRef)
//                 console.log('spelId', spelId, 'file.name', file.name)
//                 try {
//                     const snapshot = await uploadBytes(storageRef, file)
//                     const url = await getDownloadURL(snapshot.ref)
//                     setExperimentData(prev => ({ ...prev, image: url }))
//                 } catch (error) {
//                     setError('Kunne ikke laste opp bildet.')
//                 }
//             }
//         }
//     }
//
//     const handleSubmit = async () => {
//         console.log('handleSubmit')
//         if (
//             Number(experimentData.utfallMin) >= Number(experimentData.utfallMax)
//         ) {
//             setError('Minimum må være mindre enn maksimum')
//             return
//         }
//
//         try {
//             const experimentRef = collection(db, `spel/${spelId}/eksperiment`)
//             console.log('experimentRef', experimentRef)
//             console.log('experimentData', experimentData)
//             await addDoc(experimentRef, {
//                 ...experimentData,
//                 utfallMin: Number(experimentData.utfallMin),
//                 utfallMax: Number(experimentData.utfallMax),
//                 status: EXPERIMENT_STATUS.OPPRETTA,
//                 createdAt: new Date(),
//                 publikumConsensus: null,
//                 correctResult: null,
//             })
//             setExperimentData({
//                 title: '',
//                 description: '',
//                 utfallMin: 0,
//                 utfallMax: 1000,
//                 image: null,
//             })
//             onClose()
//         } catch (error) {
//             setError('Kunne ikke legge til eksperiment. Prøv igjen.')
//         }
//     }
//
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//             <DialogTitle>Legg til nytt eksperiment</DialogTitle>
//             <DialogContent>
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: 2,
//                         mt: 1,
//                     }}
//                 >
//                     <TextField
//                         label="Tittel"
//                         value={experimentData.title}
//                         onChange={handleChange('title')}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Beskrivelse"
//                         value={experimentData.description}
//                         onChange={handleChange('description')}
//                         multiline
//                         rows={3}
//                         fullWidth
//                     />
//                     <Box sx={{ display: 'flex', gap: 2 }}>
//                         <TextField
//                             label="Minimum verdi"
//                             type="number"
//                             value={experimentData.utfallMin}
//                             onChange={handleChange('utfallMin')}
//                             fullWidth
//                         />
//                         <TextField
//                             label="Maksimum verdi"
//                             type="number"
//                             value={experimentData.utfallMax}
//                             onChange={handleChange('utfallMax')}
//                             fullWidth
//                         />
//                     </Box>
//                     <Button variant="outlined" component="label">
//                         Last opp bilde
//                         <input
//                             type="file"
//                             hidden
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                         />
//                     </Button>
//                     {experimentData.image && (
//                         <Box sx={{ mt: 1 }}>
//                             <img
//                                 src={experimentData.image}
//                                 alt="Opplastet bilde"
//                                 style={{ maxWidth: '100%', maxHeight: '200px' }}
//                             />
//                         </Box>
//                     )}
//                     {error && (
//                         <Alert severity="error" onClose={() => setError('')}>
//                             {error}
//                         </Alert>
//                     )}
//                 </Box>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Avbryt</Button>
//                 <Button
//                     onClick={handleSubmit}
//                     variant="contained"
//                     disabled={
//                         !experimentData.title ||
//                         !experimentData.description ||
//                         Number(experimentData.utfallMin) >=
//                             Number(experimentData.utfallMax)
//                     }
//                 >
//                     Legg til
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     )
// }
