import "./ChessGame.css"
import {Button} from "@mui/material";
import {Chessboard, defaultPieces} from "react-chessboard";
import {Chess} from "chess.js"
import {useParams} from "react-router";
import {useRef, useState} from "react";


export default function ChessGame() {

    const { gameId: _gameId } = useParams();
    const chessGameRef = useRef(new Chess());

    const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
    const [squareOptions, setSquareOptions] = useState({});
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [promotionMove, setPromotionMove] = useState(null);

    function onPieceDrag({ square }) {
        getAndSetPossibleMoves(square);
    }

    function getAndSetPossibleMoves(square) {
        const game = chessGameRef.current;

        const moves = game.moves({ square: square, verbose: true });

        if (moves.length === 0) {
            setSquareOptions({});
            return;
        }

        setPossibleMoves(moves);
        const updatedSquares = {};
        for (const move of moves) {
            const color = game.squareColor(move.to) === "dark" ? "rgb(60,97,134)" : "rgb(168,170,178)";

            updatedSquares[move.to] = {
                background:
                    game.get(move.to) &&
                    game.get(move.to)?.color !== game.get(square)?.color
                        ? "radial-gradient(circle, " + color + " 85%, transparent 85%)" // larger circle for capturing
                        : "radial-gradient(circle, " + color + " 20%, transparent 20%)", // smaller circle for moving
                borderRadius: "50%",
            };
        }
        updatedSquares[square] = { boxShadow: "inset 0px 0px 0px 1px black" };
        setSquareOptions(updatedSquares);
    }

    function onPieceDrop({ sourceSquare, targetSquare })
    {
        const game = chessGameRef.current;

        if (!targetSquare)
            return false;

        if (isValidMove(sourceSquare, targetSquare) && isPromotionMove(sourceSquare, targetSquare)) {
            setPromotionMove({ sourceSquare, targetSquare, turn: game.turn() });
            setSquareOptions({});
            setPossibleMoves([]);
            return true;
        }

        try {
            game.move({ from: sourceSquare, to: targetSquare });
            setChessPosition(game.fen());
            setSquareOptions({});
            setPossibleMoves([]);
            return true;
        } catch {
            return false;
        }
    }

    function isValidMove(source, target) {
        const game = chessGameRef.current;
        try {
            game.move({from: source, to: target, promotion: "q" });
            game.undo();
            return true;
        } catch {
            return false;
        }
    }

    function onSquareClick({ square, piece })
    {
        const game = chessGameRef.current;

        if (possibleMoves.length !== 0) {
            for (const move of possibleMoves) {
                if (square === move.to) {
                    if (isPromotionMove(move.from, move.to)) {
                        setPromotionMove({ sourceSquare: move.from, targetSquare: square, turn: game.turn() });
                        setSquareOptions({});
                        setPossibleMoves([]);
                        return;
                    }
                    game.move({ from: move.from, to: move.to })
                    setChessPosition(game.fen());
                } else {
                    getAndSetPossibleMoves(square);
                }
            }
            setSquareOptions({});
            setPossibleMoves([]);
            setPromotionMove(null);
        } else if (piece === null) {
            setPromotionMove(null);
        }

        getAndSetPossibleMoves(square);
    }

    function isPromotionMove(sourceSquare, targetSquare) {
        const game = chessGameRef.current;
        return game.get(sourceSquare).type === "p" && (targetSquare[1] === "8" || targetSquare[1] === "1");
    }

    function promote(piece) {
        const game = chessGameRef.current;

        try {
            game.move({
                from: promotionMove.sourceSquare,
                to: promotionMove.targetSquare,
                promotion: piece
            });
            setChessPosition(game.fen());
        } catch {
            // do nothing
        }
        setPromotionMove(null);
    }

    const squareSizeLength =
        document
            .querySelector(`[data-column="a"][data-row="1"]`)
            ?.getBoundingClientRect()?.width ?? 0;

    const chessboardOptions = {
        boardStyle: { width: "648px" },
        alphaNotationStyle: { fontWeight: 500 },
        numericNotationStyle: { fontWeight: 500 },
        lightSquareNotationStyle: { color: "#578cc1" },
        lightSquareStyle: { backgroundColor: "#ffffff" },
        darkSquareStyle: { backgroundColor: "#578cc1" },

        allowDragOffBoard: false,
        draggingPieceGhostStyle: { opacity: 0 },
        dropSquareStyle: { boxShadow: "inset 0px 0px 0px 0px black", },
        draggingPieceStyle: { transform: "scale(1)" },
        dragActivationDistance: 1,
        showAnimations: false,

        onPieceDrag,
        onPieceDrop,
        onSquareClick,

        position: chessPosition,
        squareStyles: squareOptions,
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <Chessboard options={chessboardOptions} />

                {promotionMove /*&& chessGameRef.current.turn() === "w" */ ? (
                    <div id="promotionMenu" style={{ height: squareSizeLength }}>
                        {(["q", "r", "n", "b"]).map((piece) => (
                            <button id="promotionOptions"
                                key={piece}
                                onClick={() => {
                                    promote(piece);
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                {defaultPieces[`${promotionMove.turn}${piece.toUpperCase()}`]()}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <Button variant="contained" onClick={() => {
                chessGameRef.current.undo();
                setChessPosition(chessGameRef.current.fen());
                setSquareOptions({});
                setPromotionMove(null);
                console.log(chessGameRef.current.fen());
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