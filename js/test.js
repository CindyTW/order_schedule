//Add an event listener to the form submit event to handle the file upload and conversion
document.getElementById("csv-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("csv-file");
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        const form = document.getElementById("order-schedule");
        const csvData = reader.result;
        const jsonData = csvToJson(csvData); // function to convert CSV to JSON
        const specificData = extractSpecificData(jsonData); // function to extract specific data
        displayData(specificData); // function to display data in table or form
        const clear = document.getElementById("clear");
        form.addEventListener("submit", submitForm);
        clear.addEventListener("click", () => resetForm(form))
    }
});

//Define a function to convert the CSV data to JSON format
let globalData = [];

function csvToJson(csvData) {
    // globalData = [];
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const jsonData = [];
    for (let i = 1; i < lines.length - 1; i++) {
        const values = lines[i].split(",");
        globalData.push([values[0], values[1], values[4]]);
        const item = {};
        for (let j = 0; j < headers.length; j++) {
            item[headers[j]] = values[j];
        }
        jsonData.push(item);
    }
    console.log(globalData);
    return jsonData;
}



//Define a function to extract specific data from the JSON object
function extractSpecificData(jsonData) {
    const specificData = jsonData.map(item => ({
        "日期": item.日期,
        "時間": item.時間.toString().replace(":00", "").replace(/^0(?!$)/, ""),
        "調頻備轉得標量(MW)": item.調頻備轉得標量 * 1000,

    }));
    return specificData;
}




//Define a function to display the extracted data in a table or form.
const form = document.getElementById("container");
function displayData(data) {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = Object.keys(data[0]);
    table.appendChild(headerRow);
    data.forEach(item => {
        const row = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = item[header];
            row.appendChild(td);
        });
        table.appendChild(row);
    });
    form.appendChild(table);
}


function submitForm(e) {
    e.preventDefault();

    let apiPattern = {};
    let tomorrowDate = globalData[0][0];
    for (let i = 0; i < 24; i++) {
        let hours = globalData[i][1].toString().replace(":00", "").replace(/^0(?!$)/, "");
        let capacity = globalData[i][2] * 1000;
        apiPattern[hours] = capacity;
    }

    const body = JSON.stringify([{
        "time": tomorrowDate,
        "capacity": apiPattern
    }]);

    console.log(body);
    enableClear();

    //http://60.248.136.217:19996/exec_table_generator
    fetch("http://61.220.100.9:19996/exec_table_generator", {
        method: "POST",
        body
    })
        .then(body => body.json())
        .then(displayMessage)
    setTimeout(() => {
        const container = document.getElementById("message");
        container.textContent = "已上傳成功..."
    }, "500");
    return false;
}


function resetForm(form) {
    form.reset();
    const clear = document.getElementById('clear');
    clear.disabled = false;
    const submit = document.getElementById('submit');
    submit.disabled = false;
    const message = document.getElementById("message");
    message.textContent = "";
    const csvFile = document.getElementById("csv-file");
    csvFile.value = "";
    const container = document.getElementById("container");
    container.textContent = ""
}

function enableClear() {
    const clear = document.getElementById('clear');
    clear.removeAttribute("disabled");
    const submit = document.getElementById('submit');
    submit.disabled = true;
}


function displayMessage(response) {
    const { error, message } = response;
    const container = document.getElementById("message");
    container.textContent = message;
    if (error) {
        container.classList.add("alert-danger");
    } else {
        container.classList.remove("alert-danger");
    }
}