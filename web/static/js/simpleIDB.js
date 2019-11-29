// https://medium.com/@xon5/replacing-localstorage-with-indexeddb-2e11a759ff0c

/** SimpleIDB **/
SimpleIDB = {
	initialize() {
		return new Promise((resolve, reject) => {
			// This first deletes any database of the same name
			let deleteRequest = indexedDB.deleteDatabase('eyeCandyDB')
			deleteRequest.onerror = function() {
				reject(deleteRequest.error)
			}
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




// The rest is just Vue and UI things vvv
//
// new Vue({
//   el: '#app',
//   vuetify: new Vuetify(),
//   data: () => ({
//     initialized: false,
//     key1: '',
//     val1: '',
//     error1: null,
//     key2: '',
//     error2: null,
//     databaseOutput: null
//   }),
//   methods: {
//     initialize () {
//       this.initialized = true
//       SimpleIDB.initialize()
//     },
//     insertObject () {
//       this.error1 = null
//       try {
//         let jsonVal = (this.val1.includes('{')) ? JSON.parse(this.val1) : this.val1
//         SimpleIDB.set(this.key1, jsonVal)
//       } catch(e) { this.error1 = e.message }
//     },
//     removeObject () {
//       this.error2 = null
//       try {
//         SimpleIDB.remove(this.key2)
//       } catch(e) { this.error2 = e.message }
//     }
//   }
// })
