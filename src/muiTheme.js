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
        vert: {
            main: '#ffffed',
            dark: '#d1d1c0',
            light: '#fffdfb'
        },
        background: {
            default: '#250035',
            paper: 'rgba(255, 255, 255, 0.1)',
            // @ts-ignore
            elevation1: '#3d005a',
            elevation2: '#250035',
            elevation3: '#4a255c',
            elevation4: '#603b74',
             // elevation 1? #1a0026
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
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    minWidth: '0',
                    '&.Mui-disabled': {
                        color:'grey'
                    }
                }
            }
        },/*
        MuiContainer: {
            styleOverrides: {
                root: {
                    padding: 0
                }
            }
        },*/
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
        MuiTable: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& th': {
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                    },
                    '& td': {
                        color: theme.palette.secondary.main,
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