import PropTypes from 'prop-types'
import { useState, useEffect } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { useAuth } from '../service/firebaseService.js'
import {
    canUserCreateSpel,
    isSuperAdmin,
} from '../service/superAdminDbService.js'
import ConnectionStatus from './ConnectionStatus.jsx'
import { gameService } from '../service/gameService.js'
import { Box, Typography, IconButton, TextField } from '@mui/material'
import { Edit, Check } from '@mui/icons-material'

function HeaderNav(props) {
    return (
        <nav>
            <a href="/" class={props.url === '/' && 'active'}>
                <strong>Spel!</strong>
            </a>
            {(props.vertUser || props.reallySuperAdmin) && (
                <a href="/vert" class={props.url === '/vert' && 'active'}>
                    Vertskap
                </a>
            )}
            {props.reallySuperAdmin && (
                <a href="/admin" class={props.url === '/admin' && 'active'}>
                    Admin
                </a>
            )}
            <a href="/loggut" class={props.url === '/loggut' && 'active'}>
                Logg ut
            </a>
        </nav>
    )
}

HeaderNav.propTypes = {
    url: PropTypes.string,
    vertUser: PropTypes.bool,
    reallySuperAdmin: PropTypes.bool,
}

export function Header() {
    const { url } = useLocation()
    const { user, loading } = useAuth()
    const [isReallySuperAdmin, setIsReallySuperAdmin] = useState(false)
    const [isVertUser, setIsVertUser] = useState(false)
    const [userObject, setUserObject] = useState({ nickname: '-.|.-' })
    const [isEditing, setIsEditing] = useState(false)
    const [editedNickname, setEditedNickname] = useState('')

    useEffect(() => {
        if (!user) {
            return
        }
        async function findUserObject() {
            const usr = await gameService.findUserById(user.uid)
            setUserObject(usr)
        }
        findUserObject()
    }, [user])

    useEffect(() => {
        async function checkAdmin() {
            if (user) {
                const adminStatus = await isSuperAdmin(user.uid)
                // console.log(user.email, 'adminStatus', adminStatus)
                setIsReallySuperAdmin(adminStatus)
            }
        }
        checkAdmin()
    }, [user])

    useEffect(() => {
        async function checkVertUser() {
            if (user) {
                const vertStatus = await canUserCreateSpel(user.uid)
                // console.log(user.email, 'vertStatus', vertStatus)
                setIsVertUser(vertStatus)
            }
        }
        checkVertUser()
    }, [user])

    console.log('got a url here...', url)
    if (url.match('resultat')) {
        return null
    }

    const handleEditClick = () => {
        setEditedNickname(userObject.nickname || '')
        setIsEditing(true)
    }

    const handleSubmit = async () => {
        if (!user || !editedNickname.trim()) return

        try {
            await gameService.updateUserNickname(user.uid, editedNickname)
            setUserObject({ ...userObject, nickname: editedNickname.trim() })
            setIsEditing(false)
        } catch (err) {
            console.error('Failed to update nickname:', err)
        }
    }

    return (
        <header
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                background: 'transparent',
                borderBottom: 'solid black 1px',
            }}
        >
            <Box sx={{ alignSelf: 'flex-start' }}>
                <Typography
                    color="primary"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Sans-Serif',
                        color: 'primary.main',
                    }}
                >
                    Alle mot 1
                </Typography>
            </Box>
            <Box
                sx={{
                    alignSelf: 'flex-start',
                    color: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {loading
                    ? 'Loading...'
                    : userObject && (
                        isEditing ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    size="small"
                                    value={editedNickname}
                                    onChange={(e) => setEditedNickname(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                    autoFocus
                                    sx={{ width: '120px' }}
                                />
                                <IconButton onClick={handleSubmit} size="small" sx={{ color: 'secondary.main' }}>
                                    <Check />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleEditClick}>
                                <span>{userObject.nickname}</span>
                                <IconButton size="small" sx={{ color: 'secondary.main' }}>
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Box>
                        )
                    )}
            </Box>
            <HeaderNav
                url={url}
                vertUser={isVertUser}
                reallySuperAdmin={isReallySuperAdmin}
            />
            <ConnectionStatus />
        </header>
    )
}
