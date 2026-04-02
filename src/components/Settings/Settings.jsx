import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";


export default function Settings() {
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
            <Button variant="contained" color="error">
                Delete your account
            </Button>
        </Box>
    )
}