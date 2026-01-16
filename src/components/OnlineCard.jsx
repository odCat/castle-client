import {Button, Stack} from "@mui/material";


export default function OnlineCard() {

    return (
        <Stack direction="column" spacing={0.5}>
            <Button variant="contained">Login</Button>
            <Button variant="contained">Register</Button>
        </Stack>
    )
}