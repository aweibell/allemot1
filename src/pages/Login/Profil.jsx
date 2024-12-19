import { useAuth } from '../../service/firebaseService.js'

export const Profil = () => {
    const { user, loading } = useAuth()

    console.log('user', user)
    console.log('loading', loading)
    if (!user || loading) {
        return <div> Loading user {loading}</div>
    }
    return <div>User here</div>
}
