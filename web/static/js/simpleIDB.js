// https://medium.com/@xon5/replacing-localstorage-with-indexeddb-2e11a759ff0c

/** SimpleIDB **/
export let SimpleIDB = {
	initialize() {
		return new Promise((resolve, reject) => {
			// This first deletes any database of the same name
			// let deleteRequest = indexedDB.deleteDatabase('eyeCandyDB')
			// deleteRequest.onerror = function() {
			// 	reject(deleteRequest.error)
			// }
			// Then creates a new one
			let request = indexedDB.open('eyeCandyDB')
			request.onupgradeneeded = function() {
				request.result.createObjectStore('myStore')
				resolve()
			}
			request.onerror = function() {
				reject(request.error)
			}
		})
	},

	get(key) {
		return new Promise((resolve, reject) => {
			let openRequest = indexedDB.open('eyeCandyDB')
			openRequest.onsuccess = function() {
				let db = openRequest.result
				let transaction = db.transaction('myStore', 'readonly')
				let objectStore = transaction.objectStore('myStore')
				let getRequest = objectStore.get(key)
				getRequest.onsuccess = function() {
					resolve(getRequest.result)
				}
				getRequest.onerror = function() {
					reject(getRequest.error)
				}
			}
			openRequest.onerror = function() {
				reject(openRequest.error)
			}
		})
	},


	getAndSet(key, func, value) {
		// attempt to update current value using `func`
		// `func` should take one arg and return a new value e.g. `(x) => x+1`
		// if the key is not yet set, instead initialize to `value`
		return new Promise((resolve, reject) => {
			let openRequest = indexedDB.open('eyeCandyDB')
			openRequest.onsuccess = function() {
				let db = openRequest.result
				let transaction = db.transaction('myStore', 'readwrite')
				let objectStore = transaction.objectStore('myStore')
				let getRequest = objectStore.get(key)
				let newValue
				getRequest.onsuccess = function() {
					if (getRequest.result) {
						// found value for key
						newValue = func(getRequest.result)
					} else {
						// no value for key
						newValue = value
					}
					let putRequest = objectStore.put(newValue, key)
					putRequest.onsuccess = function() {
						resolve(newValue)
					}
					putRequest.onerror = function() {
						reject(putRequest.error)
					}
				}
				getRequest.onerror = function() {
					reject(getRequest.error)
				}
			}
			openRequest.onerror = function() {
				reject(openRequest.error)
			}
		})
	},


	getKeysWithPrefix(keyPrefix) {
		return new Promise((resolve, reject) => {
			const prefixLast = keyPrefix.length - 1
			const lastChar = String.fromCharCode(keyPrefix.charCodeAt(prefixLast) + 1)
			const upperBound = keyPrefix.slice(0,prefixLast)+lastChar
			const keyRangeValue = IDBKeyRange.bound(keyPrefix, upperBound)

			let openRequest = indexedDB.open('eyeCandyDB')
			openRequest.onsuccess = function() {
				let db = openRequest.result
				let transaction = db.transaction('myStore', 'readonly')
				let objectStore = transaction.objectStore('myStore')
				let getRequest = objectStore.getAllKeys(keyRangeValue)
				getRequest.onsuccess = function() {
					resolve(getRequest.result)
				}
				getRequest.onerror = function() {
					reject(getRequest.error)
				}
			}
			openRequest.onerror = function() {
				reject(openRequest.error)
			}
		})
	},

	clearAll() {
		// delete all objects in store
		return new Promise((resolve, reject) => {
			let openRequest = indexedDB.open('eyeCandyDB')
			openRequest.onsuccess = function() {
				let db = openRequest.result
				let transaction = db.transaction('myStore', 'readwrite')
				let objectStore = transaction.objectStore('myStore')
				let clearRequest = objectStore.clear()
				clearRequest.onsuccess = function() {
					resolve()
				}
				clearRequest.onerror = function() {
					reject(clearRequest.error)
				}
			}
			openRequest.onerror = function() {
				reject(openRequest.error)
			}
		})
	},

	set(key, value) {
		return new Promise((resolve, reject) => {
			let openRequest = indexedDB.open('eyeCandyDB')
			openRequest.onsuccess = function() {
				let db = openRequest.result
				let transaction = db.transaction('myStore', 'readwrite')
				let objectStore = transaction.objectStore('myStore')
				let putRequest = objectStore.put(value, key)
				putRequest.onsuccess = function() {
					resolve()
				}
				putRequest.onerror = function() {
					reject(putRequest.error)
				}
			}
			openRequest.onerror = function() {
				reject(openRequest.error)
			}
		})
	},

	remove(key) {
		return new Promise((resolve, reject) => {
			let openRequest = indexedDB.open('eyeCandyDB')
			openRequest.onsuccess = function() {
				let db = openRequest.result
				let transaction = db.transaction('myStore', 'readwrite')
				let objectStore = transaction.objectStore('myStore')
				let deleteRequest = objectStore.delete(key)
				deleteRequest.onsuccess = function() {
					resolve()
				}
				deleteRequest.onerror = function() {
					reject(deleteRequest.error)
				}
			}
			openRequest.onerror = function() {
				reject(openRequest.error)
			}
		})
	}
}
