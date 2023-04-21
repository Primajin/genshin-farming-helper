/* global localStorage */
// localStorage may be used only after it has been checked against being undefined

/**
 * Returns the current value associated with the given key, or null if the given key does not exist.
 * @param _key {string}
 * @returns {string | null}
 */
const getItem = _key => null;

/**
 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
 * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
 * Dispatches a storage event on Window objects holding an equivalent Storage object.
 * @param _key {string}
 * @param _value {string}
 * @returns {void}
 */
const setItem = (_key, _value) => {};

/**
 * Getter and setter for local storage
 * @type {{getItem: (function(string): string | null), setItem: setItem}|Storage} fromLocalStorage
 */
const fromLocalStorage = typeof localStorage === 'undefined' ? {getItem, setItem} : localStorage;

/**
 * Getter and setter for local storage for lazy people who don't want to call JSON parse all the time
 * @type {{set: (function(string, *): void), get: (function(string): any)}}
 */
const storage = {
	get: key => JSON.parse(fromLocalStorage.getItem(key)),
	set: (key, value) => fromLocalStorage.setItem(key, JSON.stringify(value)),
};

export default storage;
