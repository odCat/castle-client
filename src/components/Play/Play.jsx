import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import {Box, Button, Card, Container, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useState} from "react";


const GameList = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: "40px",
    justifyContent: 'center',
})

const GameContainer = styled(Container)({
    width: "200px",
    height: "200px",
    zIndex: 1,
    flex: "0 0 auto"
})

export default function Play() {

    const [color, setColor] = useState("white");

    function changeColor(event) {
        setColor(event.target.value);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <Card sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "400px",
            }}>
                <Typography variant="h6" sx={{ ml: 1 }}>Create Game</Typography>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="color-label">Color</InputLabel>
                    <Select
                        labelId="color-label"
                        variant={"filled"}
                        value={color}
                        label="Color"
                        onChange={ changeColor }
                    >
                        <MenuItem value={"white"}>White</MenuItem>
                        <MenuItem value={"black"}>Black</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="outlined">Create</Button>
            </Card>

            <Divider sx={{ my: 5.5 }} />

            <GameList sx={{ maxWidth: "700px" }}>
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
        </div>
    )
}