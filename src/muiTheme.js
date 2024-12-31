import { createTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'

export const allemot1Theme = createTheme({
    palette: {
        primary: {
            main: '#e9d862',
        },
        secondary: {
            main: '#f1f1f1',
        },
        user: {
            main: '#d91883',
        },
        deltakar: {
            main: '#fd7a20',
        },
        publikum: {
            main: '#a700fe',
        },
        background: {
            default: '#250035',
            paper: 'rgba(255, 255, 255, 0.1)',
            elevation1: '#3d005a',
            elevation2: '#250035',
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: 'white',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                },
            },
        },
        MuiListItemButton: {
            // defaultProps: {
            //     variants: ['eksperimentStatus', 'myCustomVariant']
            // },
            styleOverrides: {
                root: {
            variants: [
                {
                    props: { variant: 'eksperimentStatus' },
                    style: ({ theme }) => ({
                        color: theme.palette.secondary.main,
                        '&:hover': {
                            color: theme.palette.getContrastText(
                                theme.palette.primary.light
                            ),
                            backgroundColor: alpha(
                                theme.palette.primary.light,
                                0.5
                            ),
                        },
                        '&.Mui-selected': {
                            color: theme.palette.getContrastText(
                                theme.palette.primary.main
                            ),
                            backgroundColor: theme.palette.primary.main,
                        },
                    }),
                },
            ],
            },
        },
    },
        MuiCard: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { variant: 'translucent' },
                            style: {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        },
                        {
                            props: { variant: 'transparent' },
                            style: {
                                backgroundColor: 'transparent',
                            },
                        },
                    ],
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: 'white',
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                        },
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiTableRow': {
                        '& .MuiTableCell': {
                            color: theme.palette.primary.main,
                        },
                    },
                }),
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    minHeight: '100vh',
                    backgroundColor: '#250035 !important',
                    padding: 0,
                },
            },
        },
    },
})
