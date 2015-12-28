window.onload = function() {
    document.querySelector('#nojs').remove();
}

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
                    renderHabit(ul, habit[k]);
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
        var a = document.createElement("a");
//        var a2 = document.createElement('a');
        
        a.setAttribute("href", "#habit");
        a.appendChild(document.createTextNode("done"));
//        a2.setAttribute('href', '#habit'); //diff href value??
//        a2.appendChild(document.createTextNode('remove'));

        li.setAttribute("data-id", habit.id);
        li.appendChild(text);
        li.appendChild(a);
//        li.appendChild(a2);

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
                event.preventDefault();
                var action = {};
                model.load("action", function(actions) {
                    action.id = actions.length;
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
                //action.interval can be calculated and backfilled later
            });
        }
    };
}
