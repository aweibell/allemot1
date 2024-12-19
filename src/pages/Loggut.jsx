import { useEffect } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { logoutUser } from '../service/firebaseService.js'

export const LogoutPage = () => {
    const { route } = useLocation()

    useEffect(() => {
        logoutUser().then(() => {
            route('/')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>Loggar ut...</div>
}
