import { useEffect, useState } from 'preact/hooks'
import { Alert, Box, Snackbar } from '@mui/material'
import { SpelForm } from '../../components/SpelForm.jsx'
import { SpelList } from '../../components/SpelList.jsx'
import { createSpel, getSpelByUser } from '../../service/vertDbService.js'
import { useAuth } from '../../service/firebaseService.js'

export const Vert = () => {
    const [message, setMessage] = useState({ type: '', text: '' })
    const { user } = useAuth()
    const [spelByUser, setSpelByUser] = useState()
    useEffect(() => {
        if (!user) return
        async function getSpel() {
            const spel = await getSpelByUser(user.id)
            setSpelByUser(spel)
        }
        getSpel()
    }, [user])
    return (
        <div>
            <SpelForm onSubmit={createSpel} setMessage={setMessage} />
            {Array.isArray(spelByUser) ? (
                <SpelList spel={spelByUser} />
            ) : (
                <Box>Leitar opp spela dine...</Box>
            )}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={() => setMessage({ type: '', text: '' })}
            >
                <Alert
                    severity={message.type}
                    onClose={() => setMessage({ type: '', text: '' })}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </div>
    )
}
