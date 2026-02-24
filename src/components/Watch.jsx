import {Box, Container} from "@mui/material";
import {styled} from "@mui/material/styles";


const GameList = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: "40px",
    justifyContent: 'center',
})

const GameContainer = styled(Container)({
    width: "350px",
    height: "350px",
    zIndex: 1,
    flex: "0 0 auto"
})

export default function Watch() {

    return (
        <GameList>
            <a href="/game/123">
                <GameContainer sx={{ bgcolor: "green" }} />
            </a>
            <a href="/game/124">
                <GameContainer sx={{ bgcolor: "yellow" }} />
            </a>
            <a href="/game/125">
                <GameContainer sx={{ bgcolor: "orange" }} />
            </a>
            <a href="/game/126">
                <GameContainer sx={{ bgcolor: "blue" }} />
            </a>
            <a href="/game/127">
                <GameContainer sx={{ bgcolor: "violet" }} />
            </a>
        </GameList>
    )
}