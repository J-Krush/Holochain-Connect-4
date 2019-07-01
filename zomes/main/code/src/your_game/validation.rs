
use crate::game::Game;
use crate::game_move::Move;
use super::{
    GameState,
};

use hdk::holochain_persistence_api::cas::content::Address;
use super::moves::MoveType;

/**
 *
 * To implement your own custom rule validation all you need to do is re-implement the function `is_valid` on `Move`
 *
 * This function  takes the current game and the game state (which includes all the existing moves)
 * and determines if a new candidate move is valid. Typically this will involve first matching on the move type
 * and then determining if the move is valid.
 *
 * It function must return Ok(()) if a move is valid and Err("Some error string") for an invalid move.
 * It is useful to provide descriptive error strings as these can be visible to the end user.
 *
 */

impl Move {
    pub fn is_valid(&self, game: Game, game_state: GameState) -> Result<(), String> {
        is_players_turn(self.author.clone(), &game, &game_state)?;

        match self.move_type {
            MoveType::DropPiece{column} => {
                game_state.is_in_bounds(column)?;
                game_state.is_column_full(&game_state, column)?;
            }
        }


        Ok(())
    }
}

fn is_players_turn(player: Address, game: &Game, game_state: &GameState) -> Result<(), String> {
    let moves = &game_state.moves;
    match moves.last() {
        Some(last_move) => {
            if last_move.author == player {
                Err(" It is not this player's turn".into())
            } else {
                Ok(())
            }
        },
        None => {
            // Which player goes first?
            if game.player_2 == player {
                Ok(())
            } else {
                Err("Player 2 must start".into())
            }
        }
    }
}
