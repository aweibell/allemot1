import { keyframes } from '@mui/system'
import { useEffect, useState } from 'preact/hooks'
import { h } from 'preact'
import { Box, Card, Fade, Typography } from '@mui/material'

const slideIn = keyframes`
  from { left: 0%; }
  to { left: ${props => props['--final-position']}; }
`
const animationTimeMs = 3500

const ValueMarker = ({
    position,
    color,
    label,
    value,
    animate,
    below,
    showValue = true,
}) => {
    console.log(
        `ValueMarker ${label} ${below ? '_below_' : ''} value ${value} ${showValue ? 'showValue' : '--'} ${animate ? '_animate_' : ''} position ${position}`
    )
    return (
        <Box
            sx={{
                position: 'absolute',
                [below ? 'bottom' : 'top']: below ? '23%' : '40%',
                left: `${position}%`,
                transform: 'translateX(-50%)',
                width: 4,
                height: 40,
                bgcolor: color,
                ...(animate && {
                    animation: `${slideIn} ${animationTimeMs}ms ease-out forwards`,
                    '--final-position': `${position}%`,
                }),
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    [below ? 'bottom' : 'top']: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: animate
                        ? `${slideIn} ${animationTimeMs}ms ease-out forwards`
                        : 'none',
                    '--final-position': `${position}%`,
                }}
            >
                {!below && (
                    <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                        {label}
                    </Typography>
                )}
                <Box
                    sx={{
                        bgcolor: color,
                        color: color === 'white' ? 'black' : 'white',
                        px: 1,
                        borderRadius: 1,
                        mb: below ? 1 : 0,
                        mt: below ? 0 : 1,
                    }}
                >
                    {showValue && value}
                </Box>
                {below && (
                    <Typography
                        sx={{ color: 'white', fontSize: '0.875rem', mt: 1 }}
                    >
                        {label}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
export const ResultDisplay = ({
    experiment,
    deltakarGuess,
    result,
    showAverage,
    average: publikumAvg,
    userGuess,
    onAnimationEnd,
}) => {
    const [showResult, setShowResult] = useState(false)
    const scale = experiment.utfallMax - experiment.utfallMin
    const getPosition = value => ((value - experiment.utfallMin) / scale) * 100
    const range = Math.abs(deltakarGuess - result)
    const rangeStart = Math.max(experiment.utfallMin, result - range)
    const rangeEnd = Math.min(experiment.utfallMax, result + range)
    console.log('scale', scale)
    console.log('range', range)
    console.log('rangeStart', rangeEnd)
    console.log('deltakarGuess', deltakarGuess)
    console.log('average', publikumAvg)
    console.log('userGuess', userGuess)

    useEffect(() => {
        if (showAverage) {
            console.log('%cshowAverage', 'color: red')
            const timer = setTimeout(() => {
                setShowResult(true)
                console.log('%csetShowResult true', 'color: green')
                onAnimationEnd?.()
            }, animationTimeMs)
            return () => clearTimeout(timer)
        }
    }, [showAverage])

    const getVinnarTekst = () => {
        const publikumDiff = Math.abs(result - publikumAvg)
        const deltakarDiff = Math.abs(result - deltakarGuess)
        if (publikumDiff === deltakarDiff) {
            return 'UAVGJORT'
        }
        if (publikumDiff > deltakarDiff) {
            return 'DELTAKAR VANN'
        }
        return 'PUBLIKUM VANN'
    }
    return (
        <Card variant="translucent" sx={{ p: 2 }}>
            <Box
                sx={{
                    backgroundColor: 'background.elevation1',
                    padding: '1em',
                }}
            >
                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {experiment.title}
                </Typography>
                <Typography>{experiment.description}</Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 160, my: 4 }}>
                {/* Base scale bar */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: 20,
                        bgcolor: 'rgba(0,60,112,0.8)',
                        borderRadius: 2,
                    }}
                />

                {/* Range indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: `${getPosition(rangeStart)}%`,
                        width: `${((rangeEnd - rangeStart) / scale) * 100}%`,
                        height: 20,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderRadius: 2,
                    }}
                />

                {deltakarGuess && (
                    <ValueMarker
                        position={getPosition(deltakarGuess)}
                        color="#ff5722"
                        label="Deltakar"
                        value={deltakarGuess}
                    />
                )}

                <ValueMarker
                    position={getPosition(result)}
                    color="white"
                    label="Resultat"
                    value={result}
                />

                {userGuess && (
                    <ValueMarker
                        position={getPosition(userGuess)}
                        color="#2196f3"
                        label="Du"
                        value={userGuess}
                    />
                )}

                {showAverage && (
                    <ValueMarker
                        position={getPosition(publikumAvg)}
                        color="#9c27b0"
                        label="Publikum"
                        value={publikumAvg}
                        animate={true}
                        below={true}
                        showValue={showResult}
                    />
                )}
                <Typography
                    sx={{
                        position: 'absolute',
                        bottom: -25,
                        left: 0,
                        color: 'white',
                    }}
                >
                    {experiment.utfallMin}
                </Typography>
                <Typography
                    sx={{
                        position: 'absolute',
                        bottom: -25,
                        right: 0,
                        color: 'white',
                    }}
                >
                    {experiment.utfallMax}
                </Typography>
            </Box>

            <Fade in={showResult}>
                <Box
                    sx={{
                        mt: 4,
                        p: 2,
                        border: '1px solid #ffd700',
                        borderRadius: 1,
                        textAlign: 'center',
                        color: '#ffd700',
                    }}
                >
                    <Typography variant="h5">{getVinnarTekst()}</Typography>
                </Box>
            </Fade>
        </Card>
    )
}
