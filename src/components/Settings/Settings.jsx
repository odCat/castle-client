import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/actions/actions.js";
import {useNavigate} from "react-router";
import {useState} from "react";


export default function Settings() {

    const player = useSelector(store => store.player);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    function handleClose() {
        setOpenDeleteDialog(false);
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

    return (
        <Box>
            <Typography variant="h4" sx={{ my: 10 }}>Settings</Typography>

            <Typography variant="h5">Username</Typography>
            <Divider sx={{width: "100%", my: 2, borderColor: "#424548"}}/>

            <Typography variant="h5">Password</Typography>
            <Divider sx={{width: "100%", my: 2, borderColor: "#424548"}}/>

            <Typography variant="h5">Full name</Typography>
            <Divider sx={{width: "100%", my: 2, borderColor: "#424548"}}/>

            <Typography variant="h5">Email</Typography>
            <Divider sx={{width: "100%", my: 2, borderColor: "#424548"}}/>

            <Button variant="contained">
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