"use strict";

var sessions = require('client-sessions');

/**
 * CookieHelper constructor.
 * @constructor
 */
module.exports = function() {
	var module = {};

	var cookieConfig = global.config.auth ? config.auth.cookie : {};

	/**
	 * Decode cookie.
	 * @param  {string} cookie Cookie string.
	 * @return {json}          Decoded cookie object.
	 * @public
	 */
	module.decodeCookie = function(cookie) {
		if (!cookie) {
			return null;
		}

		cookie = parseCookie(cookie);

		if (cookie[cookieConfig.cookieName]) {
			var decodedCookie = sessions.util.decode(cookieConfig, cookie[cookieConfig.cookieName]);
			if (!decodedCookie) {
				console.error("Failed to decode cookie", cookie);
				return null;
			}
			return decodedCookie.content;
		}

		return null;
	};

	/**
	 * Parse cookie string.
	 * @param  {string} cookie Cookie string.
	 * @return {json}          Cookie object.
	 * @private
	 */
	function parseCookie(cookie) {
		var obj = {};
		var pairs = cookie.split(/[;,] */);

		pairs.forEach(function(pair) {
			var eqIdx = pair.indexOf('=');
			if (eqIdx === -1) {
				return;
			}

			var key = pair.substr(0, eqIdx).trim();
			var val = pair.substr(eqIdx + 1).trim();

			if (obj[key]) {
				return;
			}

			if (val[0] === '"') {
				val = val.slice(1, -1);
			}

			try {
				obj[key] = decodeURIComponent(val);
			} catch (error) {
				obj[key] = val;
			}

		});

		return obj;
	}

	return module;
};