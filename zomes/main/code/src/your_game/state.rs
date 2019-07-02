use hdk::holochain_json_api::{
    error::JsonError, json::JsonString,
};

use crate::game_move::Move;
use crate::game::Game;
use super::MoveType;
use hdk::AGENT_ADDRESS;

/**
 *
 * As a game author you get to decide what the State object of your game looks like.
 * Most of the time you want it to include all of the previous moves as well.
 *
 * To customize the game state implement your own GameState struct. This must have a function called `initial()`
 * which returns the initial state.
 *
 */

const ROWS: usize = 6;
const COLUMNS: usize = 7;

const MAX_COLUMN_INDEX: usize = 6;
const MAX_ROW_INDEX: usize = 5;

#[derive(Clone, Debug, Serialize, Deserialize, DefaultJson)]
pub struct PlayerState {
    // pub pieces: Vec<Piece>,
    pub resigned: bool,
    pub winner: bool,
}

impl PlayerState {
    pub fn initial() -> Self {
        PlayerState {
            // pieces: Vec::new(),
            resigned: false,
            winner: false,
        }
    }
}


#[derive(Clone, Debug, Serialize, Deserialize, DefaultJson)]
pub struct GameState {
    pub moves: Vec<Move>,
    pub board: [[i32; ROWS]; COLUMNS],
    pub player_1: PlayerState,
    pub player_2: PlayerState,
}

impl GameState {
    pub fn is_column_full(&self, game_state: &GameState, column: i32) -> Result<(), String> {
        // If the top row of the column is 0, then it can receive a piece
        if game_state.board[column as usize][MAX_ROW_INDEX] == 0 {
            Ok(())
        } else {
            Err("Column is full".into())
        }
    }

    pub fn is_in_bounds(&self, column: i32) -> Result<(), String> {
        if column <= MAX_COLUMN_INDEX as i32 && column >= 0 {
            Ok(())
        } else {
            Err("Piece is not in bounds".into())
        }
    }

    pub fn initial() -> Self {
        // <<DEVCAMP>> return an initial state of a game
        Self{
            moves: Vec::new(),
            board: [[0; 6]; 7],
            player_1: PlayerState::initial(),
            player_2: PlayerState::initial(),
        }

    }

    pub fn render(&self) -> String {
        let mut disp = "\n".to_string();

        // let board_string = self.board.to_string();
        // disp.push_str(board_string);

        if let Some(last_move) = self.moves.last() {
            if last_move.author.to_string() == AGENT_ADDRESS.to_string() {
                disp.push_str("It is your opponents turn \n");
            } else {
                disp.push_str("It is your turn \n");
            }
        } else {
            disp.push_str("Non-creator must make the first move \n");
        }
        disp.push('\n');

        // disp.push_str("  x  0 1 2\ny\n");

        let board = self.board.clone();

        for y in (0..ROWS).rev() {
            disp.push_str(&format!("{}   |", y));
            for x in 0..COLUMNS {
                let c = match board[x][y] {
                    1 => "🔵",
                    2 => "🔴",
                    _ => "⚪️",
                };
                disp.push_str(&format!("{}|", c));
            }
            disp.push('\n');
        }

        if self.player_1.resigned {
            disp.push_str(&format!("Game over: Player 1 has resigned!\n"));
        } else if self.player_2.resigned {
            disp.push_str(&format!("Game over: Player 2 has resigned!\n"));
        } else if self.player_1.winner {
            disp.push_str(&format!("Game over: Player 1 is the winner!\n"));
        } else if self.player_2.winner {
            disp.push_str(&format!("Game over: Player 2 is the winner!\n"));
        }
        disp
    }

    pub fn evolve(&self, game: Game, next_move: &Move) -> GameState {
        let mut moves = self.moves.clone();
        let mut board = self.board.clone();

        moves.push(next_move.clone());

        match next_move.move_type {
            MoveType::DropPiece{column} => {
                if game.player_1 == next_move.author {
                    board = self.drop_piece(board, 1, column as usize);
                } else {
                    board = self.drop_piece(board, 2, column as usize);
                }
            }
        }

        // check if this resulted in a player victory
        let (win, player) = self.check_for_win(&board);

        let mut player_1_win = false;
        let mut player_2_win = false;
        if win && player == 1 { player_1_win = true} else if win && player == 2 { player_2_win = true};

        GameState{
            moves,
            board,
            player_1: PlayerState {
                resigned: false,
                winner: player_1_win,
            },
            player_2: PlayerState {
                resigned: false,
                winner: player_2_win,
            },
        }
    }

    pub fn drop_piece(&self, mut board: [[i32; 6]; 7], player: i32, column: usize) -> [[i32; 6]; 7] {
        let col = &board[column];
        for i in 0..col.len() {
            if col[i] == 0 {
                board[column][i as usize] = player;
                break;
            }
        }

        return board;
    }

    pub fn check_for_win(&self, board: &[[i32; 6]; 7]) -> (bool, i32) {

        // let mut win = false;

        let (win, player) = self.check_for_column_win(&board);
        if win { return (true, player); }
        let (win, player) = self.check_for_row_win(&board);
        if win { return (true, player); }
        let (win, player) = self.check_for_diagonal_win(&board);
        if win { return (true, player); }

        return (false, 0);
    }

    pub fn check_for_column_win(&self, board: &[[i32; 6]; 7]) -> (bool, i32) {
        for col in 0..board.len() {
            let mut count = 0;
            let mut player = 0;
            for row in 0..board[col].len() {
                // x = the value of the piece
                let x = board[col][row];
                if x != 0 {
                    if player == 0 || x == player {
                        player = x;
                        count = count + 1;
                        if count == 4 {
                            return (true, player);
                        }
                    } else {
                        // Restart the counter
                        player = x;
                        count = 1;
                    }
                }
            }
        }
        return (false, 0);
    }

    pub fn check_for_row_win(&self, board: &[[i32; 6]; 7]) -> (bool, i32) {
        for row in 0..board[0].len() {
            let mut count = 0;
            let mut player = 0;
            for col in 0..board.len() {
                let x = board[col][row];
                if x != 0 {
                    if player == 0 || x == player {
                        player = x;
                        count = count + 1;
                        if count == 4 {
                            return (true, player);
                        }
                    } else {
                        // Restart the counter
                        player = x;
                        count = 1;
                    }
                } else {
                    count = 0;
                    player = 0;
                }
            }
        }
        return (false, 0);
    }

    pub fn check_for_diagonal_win(&self, board: &[[i32; 6]; 7]) -> (bool, i32) {
        // Up and to the right diagonal
        for row in 0..=2 {
            for col in 0..=3 {
                if board[col][row] != 0 &&
                board[col][row] == board[col+1][row+1] &&
                board[col][row] == board[col+2][row+2] &&
                board[col][row] == board[col+3][row+3] {
                    return (true, board[col][row]);
                }
            }
        }

        // Down and to the right diagonal
        for row in 3..=5 {
            for col in 0..=3 {
                if board[col][row] != 0 &&
                board[col][row] == board[col+1][row-1] &&
                board[col][row] == board[col+2][row-2] &&
                board[col][row] == board[col+3][row-3] {
                    return (true, board[col][row]);
                }
            }
        }
        return (false, 0);
    }

}
