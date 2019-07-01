const {results, lastResult, makeMove, createGame, renderState, getState} = require('./helpers')

module.exports = (scenario) => {

  scenario("Can win", async (s, t, { alice, bob }) => {
    let game_address = await createGame(alice, bob);

	  // agent 2 must go first
	  await makeMove(bob, {
	    game: game_address,
	    timestamp: 0,
	    move_type: {DropPiece: { column: 0 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Bob made the first move")

	  await renderState(alice, game_address)

	  await makeMove(alice, {
	  	game: game_address,
	  	timestamp: 1,
	    move_type: {DropPiece: { column: 1 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Alice made the second move")

	  await renderState(alice, game_address)

	  await makeMove(bob, {
	    game: game_address,
	    timestamp: 2,
	    move_type: {DropPiece: { column: 1 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Bob made the third move")

    await renderState(alice, game_address)

    await makeMove(alice, {
	  	game: game_address,
	  	timestamp: 3,
	    move_type: {DropPiece: { column: 2 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Alice made the fourth move")

	  await renderState(alice, game_address)

    await makeMove(bob, {
	    game: game_address,
	    timestamp: 4,
	    move_type: {DropPiece: { column: 3 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Bob made the fifth move")

    await renderState(alice, game_address)

    await makeMove(alice, {
	  	game: game_address,
	  	timestamp: 5,
	    move_type: {DropPiece: { column: 2 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Alice made the sixth move")

	  await renderState(alice, game_address)

    await makeMove(bob, {
	    game: game_address,
	    timestamp: 6,
	    move_type: {DropPiece: { column: 2 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Bob made the seventh move")

    await renderState(alice, game_address)

    await makeMove(alice, {
	  	game: game_address,
	  	timestamp: 7,
	    move_type: {DropPiece: { column: 3 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Alice made the eighth move")

	  await renderState(alice, game_address)

    await makeMove(bob, {
	    game: game_address,
	    timestamp: 8,
	    move_type: {DropPiece: { column: 4 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Bob made the ninth move")

    await renderState(alice, game_address)

    await makeMove(alice, {
	  	game: game_address,
	  	timestamp: 9,
	    move_type: {DropPiece: { column: 3 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Alice made the tenth move")

    let state = await getState(alice, game_address)
    t.equal(state.Ok.player_1.winner, false, "Player 1 has not won");
    t.equal(state.Ok.player_2.winner, false, "Player 2 has not won");


	  await renderState(alice, game_address)

    await makeMove(bob, {
	    game: game_address,
	    timestamp: 10,
	    move_type: {DropPiece: { column: 3 } },
	  })
	  t.notEqual(lastResult().Ok, undefined, "Bob made the eleventh move")

	  state = await getState(alice, game_address)
	  t.equal(state.Ok.moves.length, 11, "There were eleven moves in the game")

	  // both agents should see the same game state
	  t.deepEqual(await getState(bob, game_address), await getState(alice, game_address), "Alice and Bob both see the same game state")

    t.equal(state.Ok.player_2.winner, true, "Bob is the winner");


	  // finally print all the outputs
	  // results.forEach((result, i) => {
	  //   console.log(`${i}: ${JSON.stringify(result, null, 2)}\n`)
	  // })
  })
}
