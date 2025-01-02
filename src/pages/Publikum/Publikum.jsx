import { Paper, Typography } from '@mui/material'
import allemot1Logo from '../../../public/allemot1_logo.png'
import './style.css'
import { paperSx } from '../../lib/commonSx.js'
import { useAuth } from '../../service/firebaseService'
import { canUserCreateSpel } from '../../service/superAdminDbService'
import { useState, useEffect } from 'react'

export function Publikum() {
    const { user } = useAuth()
    console.log('%cPublikum page', 'color: green; font-weight: bold')
    console.log('user', user)
    const [canCreateSpel, setCanCreateSpel] = useState(false)

    useEffect(() => {
        async function checkPermissions() {
            if (!user) {
                setCanCreateSpel(false)
                return
            }
            const canCreate = await canUserCreateSpel(user.uid)
            setCanCreateSpel(canCreate)
        }
        checkPermissions()
    }, [user])

    return (
        <div class="home">
            <img
                src={allemot1Logo}
                alt="Alle mot 1-logo"
                style={{ height: '10vw', width: '10vw' }}
            />
            <h1>Klar for Alle mot 1?</h1>
            <section>
                <Resource
                    title="Finn eit spel"
                    description="Din vert vil gi deg ein spel-kode"
                    href="/"
                />
                {(user && canCreateSpel) && (
                    <Resource
                        title="Lag eit spel"
                        description="Du kan vera vert for eit spel"
                        href="/vert"
                    />
                )}
                {(user && user.email) && (
                    <Resource
                        title="Vil du laga eit spel?"
                        description="Du kan be om å bli vert og laga eit spel sjølv"
                        href="/"
                    />
                )}
            </section>
        </div>
    )
}

function Resource({ title, description, href }) {
    return (
        <Paper
            component="a"
            href={href}
            target="_blank"
            elevation={2}
            sx={paperSx}
        >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                {title}
            </Typography>
            <Typography variant="body1" color="secondary">
                {description}
            </Typography>
        </Paper>
    )
}
