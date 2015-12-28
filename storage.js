function getStorage() {
    var namespace;
    var database;
    return {
        init: function(aNamespace, success, failure) {
            if(window.indexedDB) {
                namespace = aNamespace;
                var request = indexedDB.open(namespace);
                request.onsuccess = function(event) {
                    database = request.result;
                    success(null);
                };
                request.onfailure = function(event) {
                    failure(null);
                };
            } else {
                failure(null);
            }
        },
        createTable: function(table, success, failure) {
            if(!database) {
                failure(null);
            }
            var exists = false;
            for(var i = 0; i < database.objectStoreNames.length && !exists; i++) {
                exists = database.objectStoreNames[i] === table;
            }
            if(exists) {
                success(null);
            } else {
                var version = database.version + 1;
                database.close();
                var request = indexedDB.open(namespace, version);
                request.onsuccess = function(event) {
                    success(null);
                };
                request.onerror = function(event) {
                    failure(null);
                };
                request.onupgradeneeded = function(event) {
                    database = event.target.result;
                    var objectStore = database.createObjectStore(table, { keyPath: "id", autoIncrement: true });
                };
            }
        },
        save: function(table, obj, success, failure) {
            if(!database) {
                failure(null);
            }
            if(obj.id) {
                delete obj.id;
            } else {
                obj.id = parseInt(obj.id);
            }
            var transaction = database.transaction([table], "readwrite");
            transaction.oncomplete = function(event) {
                success(obj);
            };
            transaction.onerror = function(event) {
                failure(null);
            };
            var objectStore = transaction.objectStore(table);
            var request = objectStore.put(obj);
            request.onsuccess = function(event) {
                obj.id = event.target.result;
            };
            request.onerror = function(event) {
                failure(null);
            };
        },
        load: function(table, success, failure) {
            if(!database) {
                failure(null);
            }
            var result = [];
            var transaction = database.transaction(table);
            var objectStore = transaction.objectStore(table);
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if(cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                } else {
                    success(result);
                }
            };
        }
    };
}
