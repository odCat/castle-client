import "./Demo.css"
import {Box, Card} from "@mui/material";
import {Chessboard, ChessboardProvider, defaultPieces, SparePiece} from "react-chessboard";
import {Chess} from "chess.js"
import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import GameDebug from "../Game/GameDebug.jsx";
import {styled} from "@mui/material/styles";


const SparePiecesBox = styled(Box) ({
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    width: 'fit-content',
    margin: '0 auto',
    backgroundColor: "#474747",
});

export default function ChessGame() {

    const { gameId: _gameId } = useParams();
    const chessGameRef = useRef(new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true }));

    const [pgn, setPgn] = useState("")
    const [position, setPosition] = useState(chessGameRef.current.fen());
    const [boardOrientation, setBoardOrientation] = useState("black");
    const [squareSizeLength, setSquareSizeLength] = useState(null);
    const [squareOptions, setSquareOptions] = useState({});
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [promotionMove, setPromotionMove] = useState(null);

    // function canDragPiece({ piece }) {
    //     const game = chessGameRef.current;
    //     return game.turn() === piece.pieceType[0];
    // }

    // function onPieceDrag({ square }) {
    //     const game = chessGameRef.current;
    //     if (game.turn() === game.get(square).color)
    //         getAndSetPossibleMoves(square);
    // }

    // function getAndSetPossibleMoves(square) {
    //     const game = chessGameRef.current;
    //
    //     const moves = game.moves({ square: square, verbose: true });
    //
    //     if (moves.length === 0) {
    //         setSquareOptions({});
    //         return;
    //     }
    //
    //     setPossibleMoves(moves);
    //     const updatedSquares = {};
    //     for (const move of moves) {
    //         const color = game.squareColor(move.to) === "dark" ? "rgb(60,97,134)" : "rgb(168,170,178)";
    //
    //         updatedSquares[move.to] = {
    //             background:
    //                 game.get(move.to) &&
    //                 game.get(move.to)?.color !== game.get(square)?.color
    //                     ? "radial-gradient(circle, " + color + " 85%, transparent 85%)" // larger circle for capturing
    //                     : "radial-gradient(circle, " + color + " 20%, transparent 20%)", // smaller circle for moving
    //             borderRadius: "50%",
    //         };
    //     }
    //     updatedSquares[square] = { boxShadow: "inset 0px 0px 0px 1px black" };
    //     setSquareOptions(updatedSquares);
    // }

    // function onPieceDrop({ sourceSquare, targetSquare })
    // {
    //     const game = chessGameRef.current;
    //
    //     if (!targetSquare)
    //         return false;
    //
    //     if (isValidMove(sourceSquare, targetSquare) && isPromotionMove(sourceSquare, targetSquare)) {
    //         setPromotionMove({ sourceSquare, targetSquare, turn: game.turn() });
    //         setSquareOptions({});
    //         setPossibleMoves([]);
    //         return true;
    //     }
    //
    //     try {
    //         game.move({ from: sourceSquare, to: targetSquare });
    //         setPgn(game.pgn());
    //         setPosition(game.fen());
    //         setSquareOptions({});
    //         setPossibleMoves([]);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // }

    // function isValidMove(source, target) {
    //     const game = chessGameRef.current;
    //     try {
    //         game.move({from: source, to: target, promotion: "q" });
    //         game.undo();
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // }

    // function onSquareClick({ square, piece })
    // {
    //     const game = chessGameRef.current;
    //
    //     if (possibleMoves.length !== 0) {
    //         for (const move of possibleMoves) {
    //             if (square === move.to) {
    //                 if (isPromotionMove(move.from, move.to)) {
    //                     setPromotionMove({ sourceSquare: move.from, targetSquare: square, turn: game.turn() });
    //                     setSquareOptions({});
    //                     setPossibleMoves([]);
    //                     return;
    //                 }
    //                 game.move({ from: move.from, to: move.to })
    //                 setPgn(game.pgn());
    //                 setPosition(game.fen());
    //             } else {
    //                 getAndSetPossibleMoves(square);
    //             }
    //         }
    //         setSquareOptions({});
    //         setPossibleMoves([]);
    //         setPromotionMove(null);
    //     } else if (piece === null) {
    //         setPromotionMove(null);
    //     }
    //
    //     getAndSetPossibleMoves(square);
    // }

    // function isPromotionMove(sourceSquare, targetSquare) {
    //     const game = chessGameRef.current;
    //     return game.get(sourceSquare).type === "p" && (targetSquare[1] === "8" || targetSquare[1] === "1");
    // }

    // function promote(piece) {
    //     const game = chessGameRef.current;
    //
    //     try {
    //         game.move({
    //             from: promotionMove.sourceSquare,
    //             to: promotionMove.targetSquare,
    //             promotion: piece
    //         });
    //         setPosition(game.fen());
    //     } catch {
    //         // do nothing
    //     }
    //     setPromotionMove(null);
    // }
    useEffect(() => {
        const square = document
            .querySelector(`[data-column="a"][data-row="1"]`)
            ?.getBoundingClientRect();
        setSquareSizeLength(square?.width ?? 0);
    }, []);

    // const squareSizeLength =
    //     document
    //         .querySelector(`[data-column="a"][data-row="1"]`)
    //         ?.getBoundingClientRect()?.width ?? 0;

    function onPieceDrop({ sourceSquare, targetSquare, piece, }) {
        const game = chessGameRef.current;
        const color = piece.pieceType[0];
        const type = piece.pieceType[1].toLowerCase();

        // if the piece is dropped off the board, we need to remove it from the board
        if (!targetSquare) {
            game.remove(sourceSquare);
            setPosition(game.fen());

            // successful drop off board
            return true;
        }

        // if the piece is not a spare piece, we need to remove it from it's original square
        if (!piece.isSparePiece) {
            game.remove(sourceSquare);
        }

        // try to place the piece on the board
        const success = game.put(
            { color: color, type: type },
            targetSquare,
    );

        // show error message if cannot place another king
        if (!success) {
            alert(
                `The board already contains a ${color === 'w' ? 'white' : 'black'} King piece`,
            );
            return false;
        }

        // update the game state and return true if successful
        setPosition(game.fen());
        return true;
    }
    const blackPieceTypes= [];
    const whitePieceTypes= [];
    for (const pieceType of Object.keys(defaultPieces)) {
        if (pieceType[0] === 'b') {
            blackPieceTypes.push(pieceType);
        } else {
            whitePieceTypes.push(pieceType);
        }
    }

    const chessboardOptions = {
        boardStyle: { maxWidth: "648px", minWidth: "460px" },
        alphaNotationStyle: { fontSize: "14px", fontWeight: 500 },
        numericNotationStyle: { fontSize: "14px", fontWeight: 500 },
        lightSquareNotationStyle: { color: "#578cc1" },
        lightSquareStyle: { backgroundColor: "#ffffff" },
        darkSquareStyle: { backgroundColor: "#578cc1" },
        boardOrientation,

        draggingPieceGhostStyle: { opacity: 0 },
        // dropSquareStyle: { boxShadow: "inset 0px 0px 0px 0px black", },
        // draggingPieceStyle: { transform: "scale(1)" },
        dragActivationDistance: 1,
        showAnimations: false,

        // canDragPiece,
        // onPieceDrag,
        onPieceDrop,
        // onSquareClick,

        position: position,
        // squareStyles: squareOptions,
    };

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <ChessboardProvider options={chessboardOptions} style={{
                    backgroundColor: "#474747",
                    // display: "flex",
                    // flexDirection: "column"
                }}>

                    {squareSizeLength ? (
                        <SparePiecesBox variant="outlined">
                            {blackPieceTypes.map((pieceType) => (
                                <Box
                                    key={pieceType}
                                    style={{
                                        width: `${squareSizeLength}px`,
                                        height: `${squareSizeLength}px`,
                                    }}
                                >
                                    <SparePiece pieceType={pieceType} />
                                </Box>
                            ))}
                        </SparePiecesBox>
                    ) : null}

                    <Chessboard />

                    {squareSizeLength ? (
                        <SparePiecesBox variant="outlined">
                            {whitePieceTypes.map((pieceType) => (
                                <Box
                                    key={pieceType}
                                    style={{
                                        width: `${squareSizeLength}px`,
                                        height: `${squareSizeLength}px`,
                                    }}
                                >
                                    <SparePiece pieceType={pieceType} />
                                </Box>
                            ))}
                        </SparePiecesBox>
                    ) : null}

                </ChessboardProvider>

                {/*{promotionMove ? (*/}
                {/*    <div id="promotionMenu" style={{ height: squareSizeLength }}>*/}
                {/*        {(["q", "r", "n", "b"]).map((piece) => (*/}
                {/*            <button id="promotionOptions"*/}
                {/*                key={piece}*/}
                {/*                onClick={() => {*/}
                {/*                    promote(piece);*/}
                {/*                }}*/}
                {/*                onContextMenu={(e) => {*/}
                {/*                    e.preventDefault();*/}
                {/*                }}*/}
                {/*            >*/}
                {/*                {defaultPieces[`${promotionMove.turn}${piece.toUpperCase()}`]()}*/}
                {/*            </button>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*) : null}*/}
            </Box>

            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "400px",
                    gap: 16
                }}
            >
                { pgn !== "" &&
                    <Card sx={{ ml: 2, p: 1 }} >
                        {pgn}
                    </Card>
                }

                <GameDebug
                    chessGameRef = {chessGameRef}
                    position={position}
                    boardOrientation={boardOrientation}
                    setBoardOrientation = {setBoardOrientation}
                    setSquareOptions = {setSquareOptions}
                    setPromotionMove= {setPromotionMove}
                    setChessPosition = {setPosition}
                    setPgn = {setPgn}
                />

            </Box>
        </Box>
    )
}