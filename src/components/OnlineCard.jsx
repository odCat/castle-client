import {Button, Stack} from "@mui/material";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {visit} from "../store/actions/actions.js";


export default function OnlineCard() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function continueAsGuest() {
        dispatch(visit());
        navigate("/watch");
    }

    return (
        <Stack direction="column" spacing={0.5}>
            <Button variant="contained" onClick={continueAsGuest}>
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