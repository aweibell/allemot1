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
import { Box, Typography } from '@mui/material'

function HeaderNav(props) {
    return (
        <nav>
            <a href="/" class={props.url === '/' && 'active'}>
                <strong>Spel!</strong>
            </a>
            <a href="/profil" class={props.url === '/profil' && 'active'}>
                Profil
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
                }}
            >
                {loading
                    ? 'Loading...'
                    : userObject && <div>{userObject.nickname}</div>}
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
