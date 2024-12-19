import { TextField, Button } from '@mui/material'
import { useState } from 'preact/hooks'

export const SpelForm = ({ onSubmit, setMessage }) => {
    const [namn, setNamn] = useState('')
    const [dato, setDato] = useState('')

    const handleSubmit = async () => {
        if (namn && dato) {
            try {
                await onSubmit({ namn, dato })
                setNamn('')
                setDato('')
            } catch (e) {
                setMessage('Greidde ikkje oppretta spelet')
            }
        }
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter' && namn && dato) handleSubmit()
    }

    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <TextField
                label="Spel namn"
                value={namn}
                onChange={e => setNamn(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <TextField
                label="Dato (dd.mm.yy)"
                value={dato}
                onChange={e => setDato(e.target.value)}
                onKeyDown={handleKeyPress}
                slotProps={{
                    input: {
                        pattern: '\\d{2}\\.\\d{2}\\.(\\d{2}|\\d{4})',
                    },
                }}
            />
            <Button
                variant="contained"
                color="primary"
                disabled={!namn || !dato}
                onClick={handleSubmit}
            >
                Opprett
            </Button>
        </div>
    )
}
