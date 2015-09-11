/**
 * @file This prototype is a basic finite state machine
 * used for AI logic.
 * 
 * @author Human Interactive
 */

"use strict";

var State = require("./State");

/**
 * Creates an finite state machine.
 * 
 * @constructor
 * 
 * @param {BaseGameEntity} owner - A reference to the agent that owns this instance.
 */
function StateMachine( owner ){
	
	Object.defineProperties(this, {
		_owner: {
			value: owner,
			configurable: false,
			enumerable: true,
			writable: true
		},
		currentState: {
			value: null,
			configurable: false,
			enumerable: true,
			writable: true
		},
		// a record of the last state the agent was in
		previousState: {
			value: null,
			configurable: false,
			enumerable: true,
			writable: true
		},
		// this state logic is called every time the FSM is updated
		globalState: {
			value: null,
			configurable: false,
			enumerable: true,
			writable: true
		}	
	});
}

/**
 * This method update the FSM. This method should not be called
 * in render loop, but in an separate loop for AI logic.
 */
StateMachine.prototype.update = function( ){
	
	// if a global state exists, call its execute method
	if( this.globalState !== null ){
		this.globalState.execute( this._owner );
	}
	
	// same for the current state
	if( this.currentState !== null ){
		this.currentState.execute( this._owner );
	}
};

/**
 * Changes the state of the FSM.
 * 
 * @param {State} newState - The new state of the FSM.
 */
StateMachine.prototype.changeState = function( newState ){
	
	// check type of parameter
	console.assert( newState instanceof State, "StateMachine: State parameter is no instance of type 'State'." );
	
	// keep a record of the previous state
	this.previousState = this.currentState;
	
	// call the exit method of the existing state
	this.currentState.exit( this._owner );
	
	// change state to the new state
	this.currentState = newState;
	
	// call the entry method of the new state
	this.currentState.enter( this._owner );
};

/**
 * This method changes state back to the previous state.
 */
StateMachine.prototype.revertToPrevoiusState = function(){
	
	this.changeState( this.previousState );
};

/**
 * Returns true, if the current state’s type is equal to the type of the object passed as a parameter.
 * 
 * @returns {boolean} Is the current state equal to the passed parameter?
 */
StateMachine.prototype.isInState = function( state ){
	
	return state === this.currentState;
};

module.exports = StateMachine;