import { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar, Box, Typography, Divider, TextField, Button } from '@mui/material';
import { AccountCircle, Edit, Logout } from '@mui/icons-material';
import { ThemeContext } from '@mui/styled-engine';

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
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircle sx={{ fontSize: 40 }} />
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
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar sx={{height:'3rem',
                                     width:'3rem',
                                     marginBottom:'0.2rem'}}>
                            <AccountCircle/>
                        </Avatar>
                        {isEditing ? (
                            <div className="flex flex-col gap-2 w-full">
                                <TextField
                                    type="text"
                                    value={editedNickname}
                                    onChange={(e) => setEditedNickname(e.target.value)}
                                    className="w-full px-2 py-1 border rounded"
                                    sx={(theme) => ({
                                        width: `${editedNickname.length * 10.5}px`,
                                        minWidth: '50px',
                                        maxWidth: '250px',
                                        backgroundColor: theme.palette.background.elevation1,
                                        marginTop: '0.5rem',
                                        marginBottom: '0.5rem',
                                        //padding: '0.5rem',
                                        '& .MuiInputBase-input': {
                                            padding:'0.2rem',
                                        },
                                    })}
                                    autoFocus
                                />
                                <div className="flex gap-2" style={{gap:'2rem'}}>
                                    <Button
                                        variant="contained"
                                        onClick={handleNicknameSubmit}
                                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        sx={{
                                            height: '2rem',
                                            width: '3.25rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            marginRight: '0.5rem',
                                            '&.MuiButton-root':{
                                                minWidth: '0',
                                            }
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                                        sx={{
                                            height: '2rem',
                                            width: '3.75rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            '&.MuiButton-root':{
                                                minWidth: '0',
                                            }
                                        }}
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
                                    {userObject?.nickname || 'Bruker'}
                                </Typography>
                                <Button
                                    variant='contained'
                                    sx={{fontWeight:'bolder'}}
                                    onClick={() => {
                                        setEditedNickname(userObject?.nickname || '');
                                        setIsEditing(true);
                                    }}
                                    className="text-sm text-gray-600 flex items-center gap-1"
                                >
                                    <Edit className="w-4 h-4" />
                                    <Divider sx={{width:'0.5rem'}}/>
                                    Endre navn
                                </Button>
                            </div>
                        )}
                    </div>
                    <Divider sx={{height:'0.5rem'}}/>
                    <Button
                        variant='contained'
                        sx={{fontWeight:'bolder'}}
                        onClick={() => window.location.href = '/loggut'}
                    >
                        <Logout />
                        <Divider sx={{width:'0.5rem'}}/>
                        Logg ut
                    </Button>
                </Box>
            </Menu>
        </div>
    );
};

export default AccountDropdown;