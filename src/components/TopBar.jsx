import {AppBar, Button, Toolbar} from "@mui/material";
import {styled} from "@mui/material/styles";


const TopBarButton = styled(Button)({
    color: 'white',
    display: 'block'
})

export default function TopBar() {
    return (
        <AppBar position="static" sx={{ bgcolor: '#0c1a29' }}>
            <Toolbar>
                <TopBarButton>Play</TopBarButton>
                <TopBarButton sx={{ color: 'white', display: 'block' }}>Watch</TopBarButton>
                <TopBarButton sx={{ color: 'white', display: 'block' }}>Tools</TopBarButton>
                <TopBarButton sx={{ ml: "auto", color: 'white', display: 'block' }}>User</TopBarButton>
            </Toolbar>
        </AppBar>
    )
}