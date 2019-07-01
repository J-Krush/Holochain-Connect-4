use hdk::holochain_json_api::{
    error::JsonError, json::JsonString,
};

use crate::game_move::Move;
use crate::game::Game;
use super::MoveType;


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
pub struct GameState {
    pub moves: Vec<Move>,
    pub board: [[i32; ROWS]; COLUMNS],
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
        }

    }

    pub fn render(&self) -> String {
        // <<DEVCAMP>> return a pretty formatting string representation
        "".to_string()
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

        GameState{
            moves,
            board,
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

}
