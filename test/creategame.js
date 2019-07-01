const {results, lastResult, makeMove, createGame, renderState, getState} = require('./helpers')

module.exports = (scenario) => {

  scenario("Can create a new game", async (s, t, { alice, bob }) => {
    const create_game_result = await alice.callSync('main', 'create_game', {
      opponent: bob.agentId,
      timestamp: 0,
    });

    console.log(create_game_result);

    t.equal(create_game_result.Ok.length, 46);

    const move_1_result = await bob.callSync('main', 'make_move', {
      new_move: {
        game: create_game_result.Ok,
        move_type: {DropPiece: { column: 0 }},
        timestampe: 1,
      }
    });

    t.equal(move_1_result.Err, undefined);

    const move_2_result = await alice.callSync('main', 'make_move', {
      new_move: {
        game: create_game_result.Ok,
        move_type: {DropPiece: { column: 8 }},
        timestampe: 2,
      }
    });

    t.equal(move_2_result.Ok, undefined);
  })
}
