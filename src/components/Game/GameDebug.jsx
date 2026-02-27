import {Box, Button, Card, CardContent, CardHeader} from "@mui/material";


export default function GameDebug({ chessGameRef, position, setSquareOptions, setPromotionMove, setChessPosition, setPgn })
{
    return (
        <Box sx={{ marginLeft: 2 }}>
            <Card variant="outlined" sx={{ bgcolor: 'transparent', borderColor: '#424548' }}>

                <CardHeader title="Chess Game Debug" sx={{ bgcolor: '#eaf4ff' }} />

                <CardContent>

                    <Card sx={{ mb: 2 }}>
                        <p>{position}</p>
                    </Card>

                    <Button variant="contained" onClick={() => {
                        chessGameRef.current.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                        setChessPosition(chessGameRef.current.fen());
                        setPgn(chessGameRef.current.pgn());
                    }}>
                        Reset
                    </Button>

                    <Button variant="contained" onClick={() => {
                        chessGameRef.current.load("rnbqkb1r/pP3ppp/5n2/8/2B5/5N2/PPPp1PPP/RNBQ1RK1 w kq - 0 8");
                        setChessPosition(chessGameRef.current.fen());
                        setPgn(chessGameRef.current.pgn());
                    }}>
                        Set Position
                    </Button>

                    <Button variant="contained" onClick={() => {
                        chessGameRef.current.undo();
                        setChessPosition(chessGameRef.current.fen());
                        setPgn(chessGameRef.current.pgn());
                        setSquareOptions({});
                        setPromotionMove(null);
                    }}>
                        Undo
                    </Button>

                </CardContent>

            </Card>
        </Box>
    )
}