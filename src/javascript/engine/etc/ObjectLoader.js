/**
 * @file Prototype for loading 3D objects in object-format from the server. The
 * objects are provided with Blender.
 * 
 * @author Human Interactive
 */
"use strict";

var THREE = require( "three" );

var system = require( "../core/System" );
var eventManager = require( "../messaging/EventManager" );
var TOPIC = require( "../messaging/Topic" );

/**
 * Creates a ObjectLoader.
 * 
 * @constructor
 * @augments THREE.ObjectLoader
 * 
 */
function ObjectLoader() {

	THREE.ObjectLoader.call( this );

	this.crossOrigin = "anonymous";
}

ObjectLoader.prototype = Object.create( THREE.ObjectLoader.prototype );
ObjectLoader.prototype.constructor = ObjectLoader;

/**
 * Loads a 3D object. Overwrites the standard method of three.js.
 * 
 * @param {string} url - The URL of the 3d object.
 * @param {function} onLoad - This callback function is executed, when the model
 * is loaded and parsed.
 */
ObjectLoader.prototype.load = function( url, onLoad ) {

	var self = this;

	// build url
	url = system.cdn + url;

	// build texturePath
	if ( this.texturePath === "" )
	{
		this.texturePath = url.substring( 0, url.lastIndexOf( "/" ) + 1 );
	}

	// add nocache, if necessary
	if ( system.isDevModeActive === true )
	{
		url = url + "?" + new Date().getTime();
	}

	// create XMLHttpRequest object
	var xhr = new global.XMLHttpRequest();

	xhr.onreadystatechange = function() {

		if ( xhr.readyState === xhr.DONE )
		{
			if ( xhr.status === 200 )
			{
				if ( xhr.responseText )
				{
					// parse result
					self.parse( JSON.parse( xhr.responseText ), onLoad );

					// publish message
					eventManager.publish( TOPIC.STAGE.LOADING.COMPLETE.OBJECT, {
						url : url
					} );

				}
				else
				{
					throw "ERROR: ObjectLoader: '" + url + "' seems to be unreachable or the file is empty.";
				}
			}
			else
			{
				throw "ERROR: ObjectLoader: Could not load '" + url + "' (Status: " + xhr.status + ").";
			}
		}
	};

	// start request
	xhr.open( 'GET', url, true );
	xhr.withCredentials = true;
	xhr.send();

	// publish message to inform about status
	eventManager.publish( TOPIC.STAGE.LOADING.START.OBJECT, {
		url : url
	} );
};

module.exports = ObjectLoader;