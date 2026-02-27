import {AppBar, Button, Toolbar} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router";


const TopBarButton = styled(Button)({
    color: 'white',
    display: 'block'
})

export default function TopBar() {

    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ bgcolor: '#0c1a29' }}>
            <Toolbar>
                <TopBarButton onClick={() => navigate("/play")}>Play</TopBarButton>
                <TopBarButton onClick={() => navigate("/watch")}>Watch</TopBarButton>
                <TopBarButton onClick={() => navigate("/tools/demo")}>Demo</TopBarButton>
                <TopBarButton sx={{ ml: "auto", color: 'white', display: 'block' }}>User</TopBarButton>
            </Toolbar>
        </AppBar>
    )
}