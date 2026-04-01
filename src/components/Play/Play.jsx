import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import {
    Alert,
    Box,
    Button,
    Card,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import WaitForPlayer from "./WaitForPlayer.jsx";
import {useSelector} from "react-redux";
import {Client} from "@stomp/stompjs";
import Diagram from "../Watch/Diagram.jsx";


const GameList = styled(Box)({
    display: 'flex',
    flexDirection: "column",
    gap: 10,
    justifyContent: 'center',
})

const GameContainer = styled(Paper)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
})

const RefreshButton = styled(Button) ({
    width:"100px",
    margin: "16px"
})

export default function Play() {

    const navigate = useNavigate();
    const player = useSelector(store => store.player);
    const [color, setColor] = useState("white");
    const [myGame, setMyGame] = useState(null);
    const [inProgressGameList, setInProgressGameList] = useState([]);
    const [openGameList, setOpenGameList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchInProgressGames().then();
        fetchOpenGames().then();
    }, []);

    useEffect(() => {
        if (myGame == null)
            return;

        const client = new Client({
            brokerURL: "ws://localhost:8080/websocket",
            onConnect: () => {
                client.subscribe(`/topic/game/${myGame.id}`, (message) => {
                    const gameData = JSON.parse(message.body);
                    navigate(`/games/id/${gameData.id}`, { state: { color: color }});
                })
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });
        client.activate();

        return () => {
            client.deactivate().then();
        };
    }, [color, myGame, navigate]);

    const diagrams = inProgressGameList.map(game =>
        <Box key={game.id} onClick={() => navigate("/games/id/" + game.id)}>
            <Diagram game={game} />
        </Box>
    );

    async function fetchOpenGames() {
        try {
            const response = await fetch("http://localhost:8080/games/open");
            const json = await response.json();
            setOpenGameList(json.filter((game) => game.white !== player.username && game.black !== player.username));
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchInProgressGames() {
        try {
            const response = await fetch(`http://localhost:8080/games/inprogress/player/${player.username}`);
            const json = await response.json();
            setInProgressGameList(json);
        } catch (error) {
            console.error(error.message);
        }
    }

    function fetchGames() {
        fetchOpenGames().then();
        fetchInProgressGames().then();
    }

    function changeColor(event) {
        setColor(event.target.value);
    }

    async function createGame() {

        setErrorMessage("Unable to create a new game.");

        try {
            const response = await fetch("http://localhost:8080/games/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + player.password
                },
                body: JSON.stringify({ color: color, name: player.username })
            });
            const json = await response.json();
            setMyGame(json);
        } catch {
            handleError();
        }

    }

    async function joinGame(id) {
        const gameToJoin = openGameList.find(game => game.id === id);
        const openColor = gameToJoin.white === "" ? "white" : "black";

        setErrorMessage("Unable to join game! You have an open game.");

        try {
            const response = await fetch("http://localhost:8080/games/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + player.password
                },
                body: JSON.stringify({ id: id, color: openColor, name: player.username })
            });

            const json = await response.json();

            navigate(`/games/id/${json.id}`, { state: { color: openColor }});
        } catch {
            handleError();
        }
    }

    function handleError() {
        setOpen(true);
    }

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <Snackbar
                open={open}
                autoHideDuration={2500}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" variant="filled" onClose={() => setOpen(false)}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            { myGame === null
                ?
                    <Card sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "400px",
                        mt: 5,
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

                        <Button variant="outlined" onClick={createGame}>Create</Button>
                    </Card>
                : <WaitForPlayer game={myGame} setMyGame={setMyGame} />
            }

            <Divider sx={{ my: 2 }} />

            <RefreshButton variant="outlined" onClick={fetchGames} sx={{ alignSelf: "center" }}>Refresh</RefreshButton>

            <Divider sx={{ my: 2 }} />

            <GameList sx={{ maxWidth: "700px" }}>
                {diagrams}
            </GameList>

            <Divider sx={{ my: 2 }} />

            <GameList sx={{ maxWidth: "700px" }}>

                {openGameList.map((game, index) => (
                    <GameContainer key={index}>
                        <Typography>{"#" + game.id}</Typography>
                        <Typography>{game.white ? "White: " + game.white : "Black: " + game.black}</Typography>
                        <Button variant="outlined" onClick={() => joinGame(game.id)}>Join</Button>
                    </GameContainer>
                 ))}
            </GameList>
        </Box>
    )
}