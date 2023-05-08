
function submitForm(e) {
    e.preventDefault();
    const date = document.getElementById('date');
    const body = JSON.stringify([
        {
            "time": getDateText(new Date(date.value)),
            "capacity": getCapacity(e.target),
        }
    ]);
    enableClear()
    fetch("http://61.220.100.9:19996/exec_table_generator", {
        method: "POST",
        body
    })
    .then(body => body.json())
    .then(displayMessage)
    setTimeout(() => {
        const container = document.getElementById("message");
        container.textContent = "已上傳成功..."
    }, "2000");
    return false;
}

function resetForm(form) {
    form.reset();
    const clear = document.getElementById('clear');
    clear.disabled = true;
    const submit = document.getElementById('submit');
    submit.disabled = false;
    const container = document.getElementById("message");
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

function getCapacity(form) {
    return [...form.getElementsByClassName("order-schedule-input")]
        .map(input => Number(input.value))
        .reduce((capacity, mw, hour) => {
            capacity[hour] = mw * 1000;
            return capacity;
        }, {})
}

function getDateText(date) {
    console.log("getDateText", date);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function updateDates(form, date) {
    console.log("updateDates", form, date);
    const text = getDateText(date);
    const dates = [...form.getElementsByClassName("order-schedule-date")];
    dates.map(date => date.textContent = text)
    console.log(dates);
    console.log(text);
}

function getTomorrow() {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    return day;
}

function populateForm(form, hours=24, min=0, max=2) {
    const fragment = [...[...new Array(hours)].keys()].reduce((fragment, hour) => {
        const row = document.createElement("div");
        row.classList.add("container");
        row.classList.add("text-center");
        row.innerHTML = `<div class="row">
            <div class="col order-schedule-data order-schedule-date"></div>
            <div class="col order-schedule-data">${hour}</div>
            <div class="col order-schedule-data">
                <input class="order-schedule-input" type="number" name="capacity" min="${min}" max="${max}" required>
            </div>
        </div>`;
        fragment.appendChild(row);
        return fragment;
    }, document.createDocumentFragment());
    form.prepend(fragment);

}

function main() {
    const form = document.getElementById("order-schedule");
    const clear = document.getElementById("clear");
    const date = document.getElementById('date');
    const tomorrow = getTomorrow();
    form.addEventListener("submit", submitForm);
    clear.addEventListener("click", () => resetForm(form))
    populateForm(form, 24);
    date.value = getDateText(tomorrow);
    updateDates(form, tomorrow);
    date.addEventListener("change", e => updateDates(form, new Date(e.target.value)));
}

window.onload = main;