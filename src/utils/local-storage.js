/* global localStorage */
const localStorageKey = 'genshin-farming-helper';

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
 * @type {{getItem: (function(key: string): string | null), setItem: (function(key: string, value: string): void)}|Storage}
 */
const fromLocalStorage = typeof localStorage === 'undefined' ? {getItem, setItem} : localStorage;
// LocalStorage may be used only after it has been checked against being undefined

/**
 * Getter and setter for local storage for lazy people who don't want to call JSON parse all the time
 * @type {{set: (function(any): void), get: (function(): any)}}
 */
const storage = {
	get: () => JSON.parse(fromLocalStorage.getItem(localStorageKey)),
	set: value => fromLocalStorage.setItem(localStorageKey, JSON.stringify(value)),
};

export default storage;
