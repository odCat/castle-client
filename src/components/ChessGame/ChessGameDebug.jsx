import {Button} from "@mui/material";


export default function ChessGameDebug({ chessGameRef, setSquareOptions, setPromotionMove, setChessPosition })
{
    return (
        <div>
            <Button variant="contained" onClick={() => {
                chessGameRef.current.undo();
                setChessPosition(chessGameRef.current.fen());
                setSquareOptions({});
                setPromotionMove(null);
            }}>Undo</Button>
            <Button variant="contained" onClick={() => {
                chessGameRef.current.load("rnbqkb1r/pP3ppp/5n2/8/2B5/5N2/PPPp1PPP/RNBQ1RK1 w kq - 0 8");
                setChessPosition(chessGameRef.current.fen());
            }}>
                Set Position
            </Button>
        </div>
    )
}