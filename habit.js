/**
 * TODO:
 * habit api: incorporate interval and expiration attributes
 * delete habit from list
 * madlibs form
 * streak counting
 * mark habit inactive
 * make notifications for habit expiration
 * implement a webworker for updates
 * make habit creation form from habit object api
 * convert between human readable and utc
 * delay habit start time by adding a beginTime
 * list habits by 'due date'
 * limit habit at 10
**/

window.onload = function() {
    document.querySelector('#nojs').remove();
    var storage = getStorage();
    var appMain = document.querySelector('main');
    var habits = getHabits(appMain, storage); //should just be habits and actions

    storage.init("habit", function() {    
        storage.createTable("habit", function() {
            storage.createTable("action", function() {
                //this can soon be replaced with habit.init(), which will call render
                storage.load("habit", function(list) {
                    storage.load("action", function(actions) {
                        habits.init(list, actions);
                    }, function() {
                        console.log("could not retrive actions");
                    });
                }, function() {
                    console.log("could not retreve habits");
                });
            }, function() {
                console.log("creating action table failed");
            });
        }, function() {
            console.log("creating habit table failed");
        });
    }, function() {
        console.log("indexeddb could not be initialized");
    });
};

/**
 * habit api:
 * label: the text for the habit
 * interval: the time interval for the habit in milliseconds
 * expiration: the time the streak will expire
 *   starting to second guess on expiration being a part of the habit
 * streak: some way to count streaks
 * history: record of when the habit has been 'completed' probably an array
 * active: true or false to designate if a habit is active
 * there probably needs to be a way to delete a habit as well
**/

/**
 * habit table:
 * id: a unique id assigned by indexeddb
 * label: the text description of the habit
 * interval: the frequency of the habit's execution
 * createtime: the time the habit was added to the table
 * active: whether or not the user is still wanting alto track the habit
**/

/**
 * action table:
 * id: a unique id assigned by indexeddb
 * habit: the unique id of the habit from the habit table
 * timestamp: a timestamp of when the action happened
 * interval: the difference between this timestamp and the last
**/

function getHabits(aview, amodel) {
    var view = aview;
    var model = amodel;

    function render() {
        while(view.firstChild) {
            view.firstChild.remove();
        }

        var form = document.createElement("form");
        var ul = document.createElement("ul");
        
        //form creation goes here
        getFormField(form, "text", "label", true);
        getFormField(form, "text", "interval", false);
        getFormField(form, "text", "duration", false);
        //end form creation

        renderHabitList(ul);
        
        view.appendChild(form);
        view.appendChild(ul);
    }
    
    function renderHabitList(ul) {
        console.log("render")
        while(ul.firstChild) {
            ul.firstChild.remove();
        }

        model.load("habit", function(habit) {
            model.load("action", function(action) {
                for(var i = 0; i < habit.length; i++) {
                    for(var j = action.length; j > 0 && !habit[i].expiration; j--) {
                        if(parseInt(habit[i].id) === parseInt(action[j - 1].habit)) {
                            console.log(habit[i]);
                            console.log(action[j - 1]);
                            habit[i].expiration = parseInt(action[j - 1].timestamp) + parseInt(habit[i].interval);
                        }
                    }
                    if(!habit[i].expiration) {
                        habit[i].expiration = parseInt(habit[i].createTime) + parseInt(habit[i].interval);
                    }
//                    console.log(habit[i]);
                }

                habit.sort(function(a, b) {
                    a.expiration = parseInt(a.expiration);
                    b.expiration = parseInt(b.expiration);
                    return parseInt(a.expiration - b.expiration);
                });

                for(var k = 0; k < habit.length; k++) {
                    console.log(habit[k].expiration);
                    if(habit[k].active) {
                        renderHabit(ul, habit[k]);
                    }
                }
            }, function() {
                console.log("action table not loaded");
            });
        }, function() {
            console.log("habit table not loaded");
        });
    }

    function renderHabit(ul, habit) {
        var li = document.createElement("li");
        var text = document.createTextNode(habit.label);
        var done = document.createElement("button");
        var edit = document.createElement("button");
        var del = document.createElement("button");

        done.setAttribute("type", "button");
        done.appendChild(document.createTextNode("done"));
        done.setAttribute("name", "done");

        del.setAttribute("type", "button");
        del.setAttribute("name", "delete");
        del.appendChild(document.createTextNode("delete"));

        li.setAttribute("data-id", habit.id);
        li.appendChild(text);
        li.appendChild(done);
        li.appendChild(del);

        ul.appendChild(li);
    }

    function getFormField(form, type, tag, required) {
        var label, input;
        label = form.appendChild(document.createElement("label"));
        label.setAttribute("for", tag);
        label.appendChild(document.createTextNode(tag));
        input = form.appendChild(document.createElement("input"));
        input.setAttribute("type", type);
        input.setAttribute("name", tag);
    }

    return {
        //actions being passed in need to be used to better constitute actions
        //the relevant object keys need to be prevented from storage in the db
        //these shouldn't be passed in anymore
        init: function(list, actions) {
            /**
             * How to set habit expiration:
             * Find the last action entry with the relevant habit id
             * get its timestamp and add the habit interval to it
             * 
             * This can be optimized with better load functionality on the db
             * the indexeddb api will need to be expanded for that
            **/

            //there's a better way to do this but i'm being lazy
            /*Format*/
            /*I will (label) every (interval) for (duration) */
            var form = document.createElement("form");
            var ul = document.createElement("ul");

            var button = document.createElement('input');
            
            var input = document.createElement("input");
            var input2 = document.createElement("input");
//            var input3 = document.createElement("input");

            var l1 = document.createElement("label"); //this
            var l2 = document.createElement('label');

            button.setAttribute('type', 'submit');
            button.setAttribute("name", "submit");

            input.setAttribute("type", "text");
            input.setAttribute("name", "label");
            input.required = true;
            
            input2.setAttribute("type", "text");
            input2.setAttribute("name", "interval");
            input2.defaultValue = 86400000;

            l1.appendChild(document.createTextNode("I will"));
            l1.setAttribute("for", "label"); //what input field is being marked

            l2.appendChild(document.createTextNode('every'));
            l2.setAttribute('for', 'interval');

            form.appendChild(l1);
            form.appendChild(input);
            form.appendChild(l2);
            form.appendChild(input2);
            form.appendChild(button);

            renderHabitList(ul);

            view.appendChild(form);
            view.appendChild(ul);

            form.addEventListener("submit", function(event) {
                /**
                 * the rest of the habit api should be implemented here
                 * interval should be a value that is converted to milliseconds
                 * expiration should be a calculated value and not stored here
                **/
                event.preventDefault();
                model.load("habit", function(habits) {
                    var field = event.target.querySelectorAll("input");
                    var habit = {};
                    for(var i = 0; i < field.length; i++) {
                        if(field[i].name != event.type) {
                            habit[field[i].name] = field[i].value;
                            field[i].value = field[i].defaultValue || "";
                        }
                    }
                    habit.active = true;
                    habit.createTime = Date.now();
                    habit.id = habits.length;
                    model.save("habit", habit, function() {
                        //the new habit should have the updated id
//                        habits[habit.id] = habit;
                        renderHabitList(ul);
                    }, function() {
                        console.log("something went wrong! habit not saved");                  
                    });
                }, function() {
                    console.log("habit table could not be loaded");                    
                });
            });
            ul.addEventListener("click", function(event) {
                //this is where the done button is handled
                /**
                 * if a link is clicked, update the relevant habit
                 * add a new action record to the action table
                 * then rerender the page
                 * update should include adjusting the expiration date
                **/
                //still needs to ensure a link has been clicked
//                event.preventDefault();
                if(event.target.name === "done") {
                    var action = {};
                    model.load("action", function(actions) {
//                        action.id = actions.length;
                        action.habit = event.target.parentNode.getAttribute("data-id");
                        action.timestamp = Date.now();
                        model.save("action", action, function() {
                            renderHabitList(ul);
                        }, function() {
                            console.log("action could not be recorded");
                        });
                    }, function() {
                        console.log("there was a problem: the actions table was not loaded");
                    });
                 } else if(event.target.name === "delete") {
                     //delete the object
                     model.load("habit", function(habits) {
                         var match = false;
                         for(var i = 0; i < habits.length && !match; i++) {
                             console.log(event.target.parentNode.getAttribute("data-id"));
                             if(parseInt(habits[i].id) === parseInt(event.target.parentNode.getAttribute("data-id"))) {
                                 habits[i].active = false;
                                 model.save("habit", habits[i], function(obj) {
                                    console.log(obj);
                                    match = true;
                                    renderHabitList(ul); 
                                 }, function() {
                                     console.log("there was a problem: the habit could not be saved");
                                 });
                             }
                         }
                     }, function() {
                         console.log("there was a problem: habits could not be loaded");
                     });
                 }
                //action.interval can be calculated and backfilled later
            });
        }
    };
}

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
//something is wrong here
            if(!obj.id) {
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
