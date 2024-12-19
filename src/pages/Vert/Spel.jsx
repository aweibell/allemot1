import { useState } from 'preact/hooks'
import { Button } from '@mui/material'
import { useRoute } from 'preact-iso'
import { setCurrentSpelId } from '../../service/lsService.js'
import EksperimentDialog from '../../components/EksperimentDialog.jsx'

export const Spel = () => {
    const { params } = useRoute()
    console.log('Spel params.spelId', params.spelId)
    if (params.spelId !== undefined) {
        setCurrentSpelId(params.spelId)
    }
    const [openExperimentDialog, setOpenExperimentDialog] = useState(false)

    return (
        <div>
            <Button onClick={() => setOpenExperimentDialog(true)}>
                Legg til eksperiment
            </Button>

            <EksperimentDialog
                open={openExperimentDialog}
                onClose={() => setOpenExperimentDialog(false)}
                spelId={params.spelId}
            />
        </div>
    )
}
