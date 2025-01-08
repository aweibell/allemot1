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
import { Edit, Check, AccountCircle, Menu } from '@mui/icons-material'

import AccountDropdown from './AccountDropdown.jsx'

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
            if (!user) {
                setIsReallySuperAdmin(false)
                return
            }
            const adminStatus = await isSuperAdmin(user.uid)
            setIsReallySuperAdmin(adminStatus)
        }
        checkAdmin()
    }, [user])

    useEffect(() => {
        async function checkVertUser() {
            if (!user) {
                setIsVertUser(false)
                return
            }
            const vertStatus = await canUserCreateSpel(user.uid)
            setIsVertUser(vertStatus)
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

    const handleSubmit = async (newNickname) => {
        try {
            await gameService.updateUserNickname(user.uid, newNickname);
            setUserObject({ ...userObject, nickname: newNickname.trim() });
        } catch (err) {
            console.error('Failed to update nickname:', err);
        }
    };

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
            <Box>
                <Typography
                    color="primary"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Sans-Serif',
                        color: 'primary.main',
                        fontSize: '1.5rem',
                    }}
                >
                    Alle mot 1
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <HeaderNav
                    url={url}
                    vertUser={isVertUser}
                    reallySuperAdmin={isReallySuperAdmin}
                />

                {loading
                    ? 'Loading...'
                    : userObject && (
                        <AccountDropdown
                            userObject={userObject}
                            handleSubmit={handleSubmit}
                        />
                    )}
                <ConnectionStatus />
            </Box>
        </header>
    )
}