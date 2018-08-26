// 1. Initialize Firebase
// 2. Create button for adding new sheduled item (train) - then update the html + update the database
// When adding trains, administrators should be able to submit the following:
// Train Name
// Destination  
// First Train Time -- in military time
// Frequency -- in minutes
// 3. Create a way to retrieve scheduled items from the item database.
// 4. Create a way to calculate when the next train will arrive; 
// this should be relative to the current time.

// Update time on banner every second
function timeNow() {
    var currentTime = moment().format("hh:mm A");
    $("#current-time").text(currentTime);
    setTimeout(timeNow, 1000);
}
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBUSrbVi3JbuIEeNz8HgYD28srm0qIvQYY",
    authDomain: "train-scheduler-6a949.firebaseapp.com",
    databaseURL: "https://train-scheduler-6a949.firebaseio.com",
    projectId: "train-scheduler-6a949",
    storageBucket: "train-scheduler-6a949.appspot.com",
    messagingSenderId: "292068501269"
};
firebase.initializeApp(config);
var database = firebase.database();

// 2. Form-Button for adding Items
$(document).ready(function () {
    $("#add-item-btn").on("click", function (event) {
        event.preventDefault();

        // Grabs user input
        var itmName = $("#item-name-input").val().trim();
        var itmDest = $("#dest-input").val().trim();
        var itmStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
        var itmRate = $("#rate-input").val().trim();

        // Creates local "temporary" object for holding item data
        var newItm = {
            name: itmName,
            dest: itmDest,
            start: itmStart,
            rate: itmRate
        };

        // Uploads item data to the database
        database.ref('events').push(newItm);

        // Logs everything to console
        console.log(newItm.name);
        console.log(newItm.dest);
        console.log(newItm.start);
        console.log(newItm.rate);

        // Alert
        alert("Train successfully added");

        // Clears all of the text-boxes
        $("#item-name-input").val("");
        $("#desc-input").val("");
        $("#start-input").val("");
        $("#rate-input").val("");
    });
});

// 3. Create Firebase event for adding item to the database and a row in the html when a user adds an entry
database.ref('events').on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var itmName = childSnapshot.val().name;
    var itmDest = childSnapshot.val().dest;
    var itmStart = childSnapshot.val().start;
    var itmRate = childSnapshot.val().rate;

    // Event Info
    console.log(itmName);
    console.log(itmDest);
    console.log(itmStart);
    console.log(itmRate);

    // Format the item start
    var itmStartFormat = moment.unix(itmStart).format("HH:mm");
    console.log("Event TIME: " + itmStartFormat);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(itmStart, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var startTimeConverted = moment(itmStart, "HH:mm");
    console.log("Start time : " + startTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % itmRate;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = itmRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Calculate the next arrival
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var itmNext = moment(nextTrain).format("HH:mm");
    console.log("ARRIVAL TIME: " + itmNext);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + itmName + "</td><td>" + itmDest + "</td><td>" +
        itmRate + "</td><td>" + itmNext + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
$(document).on("click", ".delete", function () {
    var keyref = $(this).data("key");
    database.ref().child(keyref).remove();
    window.location.reload();
});

timeNow();