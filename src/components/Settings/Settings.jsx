import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {logout, update} from "../../store/actions/actions.js";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";


export default function Settings() {

    const player = useSelector(store => store.player);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [username, setUsername] = useState(player.username);
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [matches, setMatches] = useState(true);
    const [fullName, setFullName] = useState(player.fullName);
    const [email, setEmail] = useState(player.email);

    useEffect(() => {
        if (password !== retypedPassword)
            setMatches(false);
        else
            setMatches(true);
    }, [password, retypedPassword]);

    async function saveChanges() {
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log(`Full Name: ${fullName}`);
        console.log(`Email: ${email}`);

        if (matches)
            console.log(`Passwords matches`);
        else
            console.log(`Passwords do not match`);

        let updateInfo = {};
        if (username != null && username !== player.username)
            updateInfo.username = username;
        if (password !== "" && matches)
            updateInfo.password = password;
        if (fullName != null)
            updateInfo.fullName = fullName;
        if (email != null && email !== player.email)
            updateInfo.email = email;
        updateInfo = JSON.stringify(updateInfo);

        try {
            const response = await fetch("http://localhost:8080/players?id=" + player.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + player.password
                },
                body: updateInfo
            });
            const json = await response.json();
            dispatch(update(json));
        } catch(error) {
            console.error(error.message);
        }
    }

    async function deleteAccount() {

        await fetch("http://localhost:8080/players?id=" + player.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + player.password
            }
        })
        dispatch(logout());
        navigate("/login");
    }

    function handleClose() {
        setOpenDeleteDialog(false);
    }

    return (
        <Box sx={{ mb: 20 }}>
            <Typography variant="h4" sx={{ my: 10 }}>Settings</Typography>

            <Typography variant="h5">Username</Typography>
            <Divider sx={{width: "100%", mt: 1, mb: 2, borderColor: "#424548"}}/>
            <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value) }
                fullWidth
                color="white"
                size="small"
                sx={{
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#424548' },
                        '&:hover fieldset': { borderColor: '#424548' },
                        '&.Mui-focused fieldset': { borderColor: '#424548' },
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#424548' },
                }}
            />

            <Typography variant="h5" sx={{ mt: 5 }}>Password</Typography>
            <Divider sx={{width: "100%", mt: 1, mb: 2, borderColor: "#424548"}}/>
            <TextField
                type="password"
                placeholder="Enter the new password"
                value={password}
                onChange={(e) => setPassword(e.target.value) }
                fullWidth
                color="white"
                size="small"
                sx={{
                    mb: 1,
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#424548' },
                        '&:hover fieldset': { borderColor: '#424548' },
                        '&.Mui-focused fieldset': { borderColor: '#424548' },
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#424548' },
                }}
            />
            <TextField
                type="password"
                placeholder="(again)"
                onChange={(e) => setRetypedPassword(e.target.value) }
                fullWidth
                color="white"
                size="small"
                sx={{
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#424548' },
                        '&:hover fieldset': { borderColor: '#424548' },
                        '&.Mui-focused fieldset': { borderColor: '#424548' },
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#424548' },
                }}
            />

            <Typography variant="h5" sx={{ mt: 5 }}>Full name</Typography>
            <Divider sx={{width: "100%", mt: 1, mb: 2, borderColor: "#424548"}}/>
            <TextField
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                color="white"
                size="small"
                sx={{
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#424548' },
                        '&:hover fieldset': { borderColor: '#424548' },
                        '&.Mui-focused fieldset': { borderColor: '#424548' },
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#424548' },
                }}
            />

            <Typography variant="h5" sx={{ mt : 5 }}>Email</Typography>
            <Divider sx={{width: "100%", mt:1, mb: 2, borderColor: "#424548"}}/>
            <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value) }
                fullWidth
                color="white"
                size="small"
                sx={{
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#424548' },
                        '&:hover fieldset': { borderColor: '#424548' },
                        '&.Mui-focused fieldset': { borderColor: '#424548' },
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#424548' },
                }}
            />

            <Button variant="contained" sx={{ mt: 5 }} onClick={ () => saveChanges() }>
                Save changes
            </Button>

            <Typography variant="h5" sx={{ color: "#d73b3e", mt: 10 }}>Delete account</Typography>
            <Divider sx={{width: "100%", my: 2, borderColor: "#424548"}}/>
            <Button variant="contained" color="error" onClick={ () => setOpenDeleteDialog(true) }>
                Delete your account
            </Button>

            <Dialog
                open={openDeleteDialog}
                onClose={handleClose}
            >
                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                <DialogContent>This action cannot be undone.</DialogContent>
                <DialogActions>
                    <Button onClick={deleteAccount} variant="contained" color="error">Delete</Button>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}