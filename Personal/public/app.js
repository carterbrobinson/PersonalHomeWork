Vue.createApp({

    data: function () {
        return {
            socket:null,
            boardState: [],
            playerID: 1,
            selectedCell: null,
            selectedRow: null,
            showNewGoalInputs: false,
            showMacros: false,
            showTipsnTricks: false,
            showEditModal: false,
            showExercises: false,
            showGoals: false,
            showLogin: true,
            showRegister: false,
            showHome: false,
            showHeader: false,
            showNav: false,
            editedGoal: {
                name: "",
                myGoal: "",
                frequency: "",
                duration: "",
                why: "",
                when: ""
            },
            isAuthenticated: false,
            editGoalId: null,
            exercises: "",
            macros: "",
            name: "",
            myGoal: "",
            frequency: "",
            duration: "",
            why: "",
            when: "",
            firstName: "",
            lastName: "",
            email: "",
            plainPassword: "",
            // userId: "",
            exerciseData: [],
            macroData: [],
            goals: [],
            errorMessages: {},
            tipsAndTricks: [
                {
                    title: "Routine",
                    description: "When working out it's typically best to have a regular routine. This means that you set apart a time each day to go to the gym, go on a run etc so that you can start to form the necessary habits to keep your routine going."
                },
                {
                    title: "Warm-Up and Cool Down",
                    description: "Emphasize the importance of warming up before exercising to prepare the body and cooling down afterward to reduce muscle soreness and prevent injury."
                },
                {
                    title: "Proper Form",
                    description: "Stress the significance of maintaining proper form during exercises to maximize effectiveness and minimize the risk of injury."
                },
                {
                    title: "Stay Hydrated",
                    description: "Remind users to drink water before, during, and after workouts to stay hydrated and maintain optimal performance."
                },
                {
                    title: "Set Realistic Goals",
                    description: "Encourage users to set achievable fitness goals that are specific, measurable, attainable, relevant, and time-bound (SMART)."
                },
                {
                    title: "Variety in Workouts",
                    description: "Advocate for incorporating a variety of exercises into workouts to target different muscle groups, prevent boredom, and avoid overuse injuries."
                },
                {
                    title: "Rest and Recovery",
                    description: "Highlight the importance of rest and recovery days to allow the body to repair and rebuild muscles, ultimately improving performance and reducing the risk of burnout."
                },
                {
                    title: "Healthy Nutrition",
                    description: "Provide tips on maintaining a balanced diet rich in lean proteins, fruits, vegetables, whole grains, and healthy fats to fuel workouts and support overall health and fitness goals."
                },
                {
                    title: "Listen to Your Body",
                    description: "Encourage users to listen to their bodies and pay attention to signals of fatigue, pain, or discomfort, adjusting their workouts accordingly to prevent injury."
                },
                {
                    title: "Consistency is Key",
                    description: "Stress the importance of consistency in exercise routines and healthy habits for long-term success and results."
                },
                {
                    title: "Seek Professional Guidance",
                    description: "Advise users to consult with fitness professionals or healthcare providers before starting a new exercise program, especially if they have any underlying health conditions or concerns."
                }
            ]
        };
    },

    methods: {
        
        sendMessage: function(message) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(message));
            } else {
                console.error("WebSocket connection not open.");
            }
        },
        
        receiveMessage(data) {
            console.log("Received message:", data);
            if (data.action === "updateBoard") {
              this.boardState = data.board;
              console.log("Updated boardState:", this.boardState);
            }
        },
        chooseMuscleGroup(muscleGroup) {
            const bingoBoard = this.generateBingoBoard(muscleGroup);
            this.boardState = bingoBoard;
        },
        generateBingoBoard(muscleGroup) {
            const bingoBoard = [];
          
            const exercises = {
              'Upper Body': ['Push-ups', 'Plank', 'Bicep Curls', 'Tricep Dips', 'Shoulder Press', 'Pull-ups', 'Dumbbell Rows', 'Bench Press', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers', 'Bicycle Crunches', 'Plank Twists', 'Supermans', 'V-ups'],
              'Lower Body': ['Squats', 'Lunges', 'Calf Raises', 'Deadlifts', 'Leg Press', 'Step-ups', 'Hamstring Curls', 'Glute Bridges', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers', 'Bicycle Crunches', 'Plank Twists', 'Supermans', 'V-ups'],
            };

            const shuffledExercises = exercises[muscleGroup].sort(() => Math.random() - 0.5);

            const selectedExercises = [...new Set(shuffledExercises)].slice(0, 16);

            for (let i = 0; i < 4; i++) {
              const row = [];
              for (let j = 0; j < 4; j++) {
                row.push(selectedExercises[i * 4 + j]);
              }
              bingoBoard.push(row);
            }
            return bingoBoard;
        },
          
        markCell(rowIndex, colIndex) {
            this.boardState[rowIndex][colIndex].selected = !this.boardState[rowIndex][colIndex].selected;
        
            this.sendMessage({
                action: 'mark',
                position: [rowIndex, colIndex],
                player: this.playerID
            });
        },

        resetSelectedCell() {
            this.selectedCell = null;
        },

        validateLogin: function() {
            this.errorMessages = {};
            if(this.email == "" ){
                this.errorMessages.email = "Please enter a valid email."
            } 
            if(this.plainPassword == ""){
                this.errorMessages.plainPassword = "Please enter a valid password."
            }
        },
        validateRegister: function() {
            this.errorMessages = {};
            if(this.firstName == ""){
                this.errorMessages.firstName = "Please enter a first name."
            }
            if(this.lastName == ""){
                this.errorMessages.lastName = "Please enter a last name."
            }
            if(this.email == ""){
                this.errorMessages.email = "Please enter an email."
            }
            if(this.plainPassword == ""){
                this.errorMessages.plainPassword = "Please enter a password."
            }
            if(response.status != 201){
                this.errorMessages.email = "Email already in use."
            }
        },
        validatePostData: function() {
            this.errorMessages = {};
            if(this.name == ""){
                this.errorMessages.name = "Please enter your name.";
            }
            if (this.myGoal == "") {
                this.errorMessages.myGoal = "Please enter a valid goal.";
            }
            if (this.frequency == ""){
                this.errorMessages.frequency = "Please select a frequency.";
            }
            if (this.duration == "") {
                this.errorMessages.duration = "Please enter a duration.";
            }
            if (this.why == ""){
                this.errorMessages.why = "Please enter a reason for your goal.";
            }
            if (this.when == "") {
                this.errorMessages.when = "Please enter a time for working towards your goal.";
            }

        },
        validatePutData: function () {
            this.errorMessages = {};
            if (this.editedGoal.name == ""){
                this.errorMessages.name = "Please enter your name."
            }
            if (this.editedGoal.myGoal == "") {
                this.errorMessages.myGoal = "Please enter a valid goal.";
            }
            if (this.editedGoal.frequency == ""){
                this.errorMessages.frequency = "Please select a frequency.";
            }
            if (this.editedGoal.duration == "") {
                this.errorMessages.duration = "Please enter a duration.";
            }
            if (this.editedGoal.why == ""){
                this.errorMessages.why = "Please enter a reason for your goal.";
            }
            if (this.editedGoal.when == "") {
                this.errorMessages.when = "Please enter a time for working towards your goal.";
            }
        },

        errorMessageForField: function(field) {
            return this.errorMessages[field];
        },
        
        errorStyleForField: function(field) {
            if(this.errorMessageForField(field)) {
                return {color: 'red'};
            }
        },

        newGoal: function() {
            this.showNewGoalInputs = true
            this.showMacros = false
            this.showTipsnTricks = false
            this.showExercises = false
            this.showGoals = false
            this.showHome = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        close: function () {
            this.showHome = true
            this.showNewGoalInputs = false
            this.showMacros = false
            this.showTipsnTricks = false
            this.showEditModal = false
            this.showExercises = false
            this.showGoals = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        cancel: function() {
            this.showNewGoalInputs = false
            this.showMacros = false
            this.showTipsnTricks = false
            this.showEditModal = false
            this.showExercises = false
            this.showGoals = true
            this.showHome = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        displayGoals: function() {
            this.showGoals = true
            this.showNewGoalInputs = false
            this.showMacros = false
            this.showTipsnTricks = false
            this.showEditModal = false
            this.showExercises = false
            this.showHome = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        showMacroAPI: function() {
            this.showMacros = true
            this.showTipsnTricks = false
            this.showNewGoalInputs = false
            this.showExercises = false
            this.showGoals = false
            this.showHome = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        showExerciseAPI: function() {
            this.showExercises = true
            this.showMacros = false
            this.showTipsnTricks = false
            this.showNewGoalInputs = false
            this.showGoals = false
            this.showHome = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        tipsntricks: function() {
            this.showTipsnTricks = true
            this.showNewGoalInputs = false
            this.showMacros = false
            this.showExercises = false
            this.showGoals = false
            this.showHome = false
            this.showLogin = false
            this.showRegister = false
            this.showHeader = true
            this.showNav = true
        },
        showLoginPage: function() {
            this.showTipsnTricks = false
            this.showNewGoalInputs = false
            this.showMacros = false
            this.showExercises = false
            this.showGoals = false
            this.showHome = false
            this.showLogin = true
            this.showRegister = false
            this.showHeader = false
            this.showNav = false
        },
        showRegisterPage: function() {
            this.showTipsnTricks = false
            this.showNewGoalInputs = false
            this.showMacros = false
            this.showExercises = false
            this.showGoals = false
            this.showHome = false
            this.showLogin = false
            this.showRegister = true
            this.showHeader = false
            this.showNav = false
        },
        clearMacroData: function () {
            this.macroData = [];
        },
        clearExerciseData: function () {
            this.exerciseData = [];
        },
        openEditModal: function (goal) {
            this.editGoalId = goal._id;
            this.editedGoal.name = goal.name;
            this.editedGoal.myGoal = goal.myGoal;
            this.editedGoal.frequency = goal.frequency;
            this.editedGoal.duration = goal.duration;
            this.editedGoal.why = goal.why;
            this.editedGoal.when = goal.when;
            this.showEditModal = true;
            this.showGoals = false;
        },

        goalButtonClickHandler: function () {
            this.addGoal();
        },

        macroButtonClickHandler: function () {
            this.calculateMacros();
        },
        exerciseButtonClickHandler: function () {
            this.findExercises();
        },
        Login: function() {
            this.validateLogin();
            if (!this.dataIsValid) {
                return;
            }
            // if (response.status != 201){

            // }
            var data = "email=" +encodeURIComponent(this.email);
            data += "&plainPassword=" +encodeURIComponent(this.plainPassword);

            fetch ("https://websocket-mghl.onrender.com/session", {
                body: data,
                method: "POST",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }}).then((response) => {
                    if (response.status == 201) {
                        console.log("Login Successful");
                        this.close();
                        this.isAuthenticated = true;
                        this.getSession();
                    } else if(response.status != 201){
                        this.errorMessages.email = "Invalid Credentials."
                        this.errorMessages.plainPassword = "Invalid Credentials."
                    }
                })
        },
        Logout: function() {

            fetch ("https://websocket-mghl.onrender.com/session", {
                method: "DELETE",
            }).then((response) => {
                    if (response.status == 200) {
                        console.log("Logout Successful");
                        this.isAuthenticated = false;
                        this.close();
                        this.showLoginPage();
                    }
                })
        },
        
        addGoal: function() {
            this.validatePostData();
            if (!this.dataIsValid) {
                return;
            }
            if (!this.isAuthenticated) {
                return;
            }
            
            var data = "name=" +encodeURIComponent(this.name); 
            data += "&myGoal=" +encodeURIComponent(this.myGoal);
            data += "&frequency=" +encodeURIComponent(this.frequency);
            data += "&duration=" +encodeURIComponent(this.duration);
            data += "&why=" +encodeURIComponent(this.why);
            data += "&when=" +encodeURIComponent(this.when);
            data += "&userID=" +encodeURIComponent(this.userID);

            fetch ("https://websocket-mghl.onrender.com/goals", {
            body: data,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }}).then((response) => {
                if (response.status == 201) {
                    response.json().then((goalsFromServer) => {
                        console.log("received goals from API:", data);
                        this.loadGoals();
                        this.myGoal = '';
                        this.frequency = '';
                        this.duration = '';
                        this.why = '';
                        this.when = '';
                        this.newGoal();
                        this.displayGoals();
                    })
                }
            })
        },
        addUser: function() {
            this.validateRegister();
            if (!this.dataIsValid) {
                return;
            }
            var data = "firstName=" + encodeURIComponent(this.firstName);
            data += "&lastName=" + encodeURIComponent(this.lastName);
            data += "&email=" + encodeURIComponent(this.email);
            data += "&plainPassword=" + encodeURIComponent(this.plainPassword);

            fetch("https://websocket-mghl.onrender.com/users", {
                body: data,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then((response) => {
                if (response.status == 201) {
                    console.log("User registered successfully");
                    this.firstName = '';
                    this.lastName = '';
                    this.email = '';
                    this.plainPassword = '';
                    this.showLoginPage();

                } else if (response.status == 422) {
                    this.errorMessages.email = "Email already in use."
                    response.json().then((errorMessages) => {
                        console.log("Validation errors: ", errorMessages);
                    });
                } else {
                    console.log("error registering user");
                }
            }).catch((error) => {
                console.error("Error registering user:", error);
            });
        },
        calculateMacros: function() {
            if (!this.isAuthenticated) {
                return;
            }
            var query = encodeURIComponent(this.macros);
            fetch('https://api.calorieninjas.com/v1/nutrition?query=' + query, {
                method: "GET",
                headers: {'X-Api-Key': 'LMnjPd7u2gKHDM4NvCSRww==KyjtuKau6UsMJTKM'}
            }).then((response) => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    console.error("Failed to fetch data from API");
                }
            }).then((data) => {
                console.log("received data from CalorieNinja:", data);
                if (data.items && data.items.length > 0) {
                    this.macroData = data.items;
                } else {
                    console.error("No data received from API");
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
                this.macroData = [];
            });
        },
        findExercises: function() {
            if (!this.isAuthenticated) {
                return;
            }
            var muscle = encodeURIComponent(this.exercises);
            fetch('https://api.api-ninjas.com/v1/exercises?muscle=' + muscle, {
                method: "GET",
                headers: {'X-Api-Key': 'LMnjPd7u2gKHDM4NvCSRww==NJg6Gv0nUczAz34Z'}
            }).then((response) => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    console.error("Failed to fetch data from API");
                }
            }).then((data) => {
                console.log("received data from ExerciseNinja:", data);
                if (data && data.length > 0) {
                    this.exerciseData = data;
                } else {
                    console.error("No data received from API");
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
                this.exerciseData = [];
            });
        },

        deleteGoal: function (goalId) {
            if (!this.isAuthenticated) {
                return;
            }
            fetch("https://websocket-mghl.onrender.com/goals/" + goalId, {
            method: "DELETE",
            }).then ((response) => {
                if (response.status == 200) {
                    this.loadGoals();
                }
            });
        },
        editGoal: function () {

            this.validatePutData();
            if (!this.dataIsValid) {
                return;
            }
            if (!this.isAuthenticated) {
                return;
            }

            var data = "name=" +encodeURIComponent(this.editedGoal.name);
            data += "&myGoal=" +encodeURIComponent(this.editedGoal.myGoal);
            data += "&frequency=" +encodeURIComponent(this.editedGoal.frequency);
            data += "&duration=" +encodeURIComponent(this.editedGoal.duration);
            data += "&why=" +encodeURIComponent(this.editedGoal.why);
            data += "&when=" +encodeURIComponent(this.editedGoal.when);
            data += "&userID=" +encodeURIComponent(this.userID);

            fetch("https://websocket-mghl.onrender.com/goals/" + this.editGoalId, {
                body: data,
                method: "PUT",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then ((response) => {
                if (response.status == 204) {
                    this.loadGoals();
                    this.showEditModal = false;
                    console.log("Goal updated successfully");
                    this.editGoalId = null;
                    this.showGoals = true;
                } else {
                    console.error('Failed to update goal:', response.statusText);
                }
            })
        },
        getSession: function() {
            fetch("https://websocket-mghl.onrender.com/session", {
                method: "GET"
            }).then((response) => {
                if (response.status == 200) {
                    console.log("Authenticated");
                    this.isAuthenticated = true;
                    this.showHome = true;
                    this.showHeader = true;
                    this.showNav = true;
                    this.showLogin = false;
                    this.loadGoals();
                } else if (response.status == 401) {
                    console.log("Not Authenticated");
                    this.showLoginPage();
                } else {
                    console.error("Failed to fetch session", response.statusText);
                }
            })
        },
        loadGoals: function() {

            fetch("https://websocket-mghl.onrender.com/goals").then ((response) => {
                if (response.status == 200) {
                    response.json().then (( goalsFromServer) => {
                        console.log("received goals from API:", goalsFromServer);
                        this.goals = goalsFromServer;
                    });
                }
            });
        }
    },
    //     startWebSocket() {
    //         const socket = new WebSocket("wss://websocket-mghl.onrender.com/");
    //         socket.onopen = () => {
    //             console.log("websocket connection open");
    //         };
    //         socket.onmessage = (event) => {
    //             this.receiveMessage(JSON.parse(event.data));
    //         }
    //         socket.onerror = (error) => {
    //             console.error("Websocket Error :", error);
    //         }
    //         socket.onclose = () => {
    //             console.log("websocket closed. reconnecting...");
    //             setTimeout(() => this.startWebSocket(), 5000);
    //         };
    //         this.socket = socket;
    //     }
    // },

    computed: {
        dataIsValid: function() {
            return Object.keys(this.errorMessages).length == 0;
        }
    },

    created: function () {
        console.log("Loaded Successfully");
        this.socket = new WebSocket ("wss://websocket-mghl.onrender.com/");
        this.socket.onmessage = (event) => {
            this.receiveMessage(JSON.parse(event.data));
        };
        // this.startWebSocket();
        this.getSession();
    }
}).mount("#app");