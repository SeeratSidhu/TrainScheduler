
var firebaseConfig = {
    apiKey: "AIzaSyC3ct0tq_F7BmNccLk6CadEDlnCEDEyWow",
    authDomain: "train-scheduler-56929.firebaseapp.com",
    databaseURL: "https://train-scheduler-56929.firebaseio.com",
    projectId: "train-scheduler-56929",
    storageBucket: "",
    messagingSenderId: "448204051339",
    appId: "1:448204051339:web:ee217fdf064ee649"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  let database = firebase.database();

//   Update html and database on adding new trains

$("#add-train-btn").on("click", function(event){
    event.preventDefault();

    let trainName = $("#train-name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let firstTrainTime = $("#first-train-input").val().trim();
    let frequency = $("#frequency-input").val().trim();

    // calculate next arrival time

    let firstTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    // current time

    let currentTime = moment();
    console.log(currentTime)
    // difference in current time and first train time

    let diffTime = currentTime.diff(moment(firstTime), "minutes");
    console.log(diffTime);
    //time apart

    let remainder = diffTime % frequency;

    //minutes until next train

    let minTillTrain = frequency - remainder;

    //Next Arrival time

    let nextTrain = moment(currentTime.add(minTillTrain, "minutes")).format("HH:mm");



    let train = {
        trainName,
        destination,
        firstTrainTime,
        frequency,
        minTillTrain,
        nextTrain
    };

    database.ref("/trains").push(train);

    $("#form-id").find("input:text").val("");
});

database.ref("/trains").on("child_added", function(snapshot){
    let train = snapshot.val();
    let trainHTML = `
    <tr>
    <td scope="col">${train.trainName}</td>
    <td scope="col">${train.destination}</td>
    <td scope="col">${train.frequency}</td>
    <td scope="col">${train.nextTrain}</td>
    <td scope="col">${train.minTillTrain}</td>
    </tr>
    `;
    $("#train-table tbody").append(trainHTML);
})