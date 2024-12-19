import { Paper, Typography } from '@mui/material'
import allemot1Logo from '../../../public/allemot1_logo.png'
import './style.css'
import { paperSx } from '../../lib/commonSx.js'

export function Publikum() {
    return (
        <div class="home">
            <img
                src={allemot1Logo}
                alt="Alle mot 1-logo"
                style={{ height: '10vw', width: '10vw' }}
            />
            <h1>Klar for å spela Alle mot 1?</h1>
            <section>
                <Resource
                    title="Finn eit spel"
                    description="Din vert vil gi deg ein spel-kode"
                    href="https://allemotein.web.app/"
                />
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
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {description}
            </Typography>
        </Paper>
    )
}
