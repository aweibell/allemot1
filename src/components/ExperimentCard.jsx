import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { ImageIcon } from '@radix-ui/react-icons'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'preact/hooks'
import EksperimentDialog from './EksperimentDialog.jsx'
import { useRoute } from 'preact-iso'

export const ExperimentCard = ({ experiment, isActive }) => {
    const { params } = useRoute()
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const hasValidRange =
        experiment.utfallMin != null && experiment.utfallMax != null

    return (
        <>
            <Card
                sx={{
                    mb: 2,
                    bgcolor: isActive ? 'primary.light' : 'background.paper',
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography variant="h6">
                                {experiment.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 1,
                                }}
                            >
                                {experiment.image && (
                                    <ImageIcon sx={{ color: 'success.main' }} />
                                )}
                                <Typography
                                    sx={{
                                        color: hasValidRange
                                            ? 'text.secondary'
                                            : 'error.main',
                                    }}
                                >
                                    {hasValidRange
                                        ? `${experiment.utfallMin} - ${experiment.utfallMax}`
                                        : 'Mangler min/max'}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton onClick={() => setOpenEditDialog(true)}>
                                <EditIcon />
                            </IconButton>
                            {/*<Button*/}
                            {/*    variant="contained"*/}
                            {/*    component={Link}*/}
                            {/*    to={`/vert/spel/${experiment.spelId}/flow`}*/}
                            {/*    disabled={!hasValidRange}*/}
                            {/*>*/}
                            {/*    Start*/}
                            {/*</Button>*/}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <EksperimentDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                spelId={params.spelId}
                experiment={experiment}
                isEditing={true}
            />
        </>
    )
}

export default ExperimentCard
