import { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar, Box, Typography, Divider, TextField, Button } from '@mui/material';
import { AccountCircle, Edit, Logout } from '@mui/icons-material';

const AccountDropdown = ({ userObject, handleSubmit }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNickname, setEditedNickname] = useState('');

    const handleNicknameSubmit = async () => {
        if (editedNickname.trim()) {
            await handleSubmit(editedNickname);
            setIsEditing(false);
        }
    };

    return (
        <div>
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    '&.MuiIconButton-root':{
                        padding: 0,
                        marginTop: '-0.4rem'
                    }
                }}
            >
                <AccountCircle
                    sx={{ fontSize: 40}}
                    color='user'
                />
            </IconButton>

            <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ width: 240, p: 2 }}>
                    <div>
                        <AccountCircle
                            sx={{
                                fontSize: 75,
                                margin: '-0.3rem'
                            }}
                            color='user'
                        />
                        {isEditing ? (
                            <div>
                                <TextField
                                    type="text"
                                    value={editedNickname}
                                    onChange={(e) => setEditedNickname(e.target.value)}
                                    sx={(theme) => ({
                                        width: '12rem',
                                        minWidth: '50px',
                                        maxWidth: '250px',
                                        width: '10rem',
                                        backgroundColor: theme.palette.background.elevation1,
                                        fontWeight: '900',
                                        marginTop: '0.5rem',
                                        marginBottom: '0.5rem',
                                        '& .MuiInputBase-input': {
                                            padding:'0.2rem',
                                        },
                                    })}
                                    autoFocus
                                />
                                <div style={{gap:'2rem'}}>
                                    <Button
                                        variant="contained"
                                        onClick={handleNicknameSubmit}
                                        sx={{
                                            marginRight: '0.5rem'
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Typography
                                    variant="subtitle1"
                                    sx={(theme) => ({
                                        fontWeight:'bold',
                                        fontSize:'1.25rem',
                                        color: theme.palette.user.main,
                                        textShadow: '1px 1px 2px black', 
                                        marginBottom:'0.2rem'})}>
                                    {userObject?.nickname || 'Gjest'}
                                    {userObject?.email ? ' (' + userObject.email + ')' : ''}
                                </Typography>
                                <Button
                                    variant='contained'
                                    sx={{
                                        fontWeight:'bolder',
                                        paddingLeft: '0.75rem'
                                    }}
                                    onClick={() => {
                                        setEditedNickname(userObject?.nickname || '');
                                        setIsEditing(true);
                                    }}
                                >
                                    <Edit />
                                    <Box sx={{width:'0.5rem'}}/>
                                    Endre navn
                                </Button>
                            </div>
                        )}
                    </div>
                    <Divider sx={{height:'0.5rem'}}/>
                    <MenuItem sx={{padding:0}}> 
                        <Button
                            variant="contained"
                            sx={{
                                fontWeight:'bolder',
                                paddingLeft: '0.75rem'
                            }}
                        >
                            <a href="/loggut" 
                            style={{ 
                                textDecoration: "none", 
                                color: "inherit", 
                                display: "flex", 
                                alignItems: "center",
                                width: '7.1rem', 
                            }}>
                                <Logout />
                                <Box sx={{ width: "0.5rem" }} />
                                Logg ut
                            </a>
                        </Button>
                    </MenuItem>
                </Box>
            </Menu>
        </div>
    );
};

export default AccountDropdown;