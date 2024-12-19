import { Box } from '@mui/material'
import { getConnectionState } from '../service/firebaseService.js'

export const ConnectionStatus = () => {
    // Signal automatically updates the component
    return (
        <Box class={`status-indicator ${getConnectionState()}`}>
            {getConnectionState() === 'connected' ? '🟢' : '🔴'}
        </Box>
    )
}
export default ConnectionStatus
