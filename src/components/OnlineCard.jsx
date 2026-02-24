import {Button, Stack} from "@mui/material";
import {useNavigate} from "react-router";


export default function OnlineCard() {

    const navigate = useNavigate();

    return (
        <Stack direction="column" spacing={0.5}>
            <Button variant="contained" onClick={() => navigate("/watch")}>
                Guest
            </Button>

            <Button variant="contained" onClick={() => navigate("/login")}>
                Login
            </Button>

            <Button variant="contained" onClick={() => navigate("/register")}>
                Register
            </Button>
        </Stack>
    )
}