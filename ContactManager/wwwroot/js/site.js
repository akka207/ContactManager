
let records = [];

getRecords();
setupSort();

let activeFilters = {
    name: false,
    married: false,
    bdate: false,
    phone: false,
    salary: false,
};

let filterValues = {
    name: "",
    married: null,
    bdate: { start: null, end: null },
    phone: "",
    salary: { min: null, max: null },
};

function getRecords() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/contacts');
    xhr.responseType = 'json';
    xhr.onload = () => {
        let status = xhr.status;
        if (status == 200) {
            records = xhr.response;
        }
        setupFilters();
        showRecords(records);
    }
    xhr.send();
}

function showRecords(records) {

    let contactsTBodyId = "contactsTBody";
    let tBody = document.getElementById(contactsTBodyId);
    if (records.length == 0) {
        tBody.innerHTML = "<td><h3>No data</h3></td>";
        return;
    }
    tBody.innerHTML = "";

    records.forEach((contact) => {
        let tr = document.createElement("tr");
        tr.id = "row" + contact.id;
        tr.className = "table-row";

        let tdButton = document.createElement("td");
        let button = document.createElement("button");
        button.className = "remove-button";
        button.addEventListener("click", () => {
            deleteContact(contact.id);
        });
        tdButton.appendChild(button);


        let nameTd = document.createElement("td");
        let nameTextBox = document.createElement("input");
        nameTextBox.setAttribute("type", "text");
        nameTextBox.className = "form-control";
        nameTextBox.value = contact.name;
        nameTextBox.addEventListener("change", () => {
            contact.name = nameTextBox.value;
            putContact(contact.id, contact);
        });
        nameTd.appendChild(nameTextBox);


        let bdateTd = document.createElement("td");
        let bdatePicker = document.createElement("input");
        bdatePicker.setAttribute("type", "date");
        bdatePicker.className = "form-control";
        bdatePicker.value = contact.dateOfBirth.substring(0, 10);
        bdatePicker.addEventListener("change", () => {
            contact.dateOfBirth = bdatePicker.value;
            putContact(contact.id, contact);
        });
        bdateTd.appendChild(bdatePicker);


        let marriedTd = document.createElement("td");
        let marriedFlag = document.createElement("input");
        marriedFlag.setAttribute("type", "checkbox");
        marriedFlag.className = "form-check";
        marriedFlag.checked = contact.married;
        marriedFlag.addEventListener("change", () => {
            contact.married = marriedFlag.checked;
            putContact(contact.id, contact);
        });
        marriedTd.appendChild(marriedFlag);


        let phoneTd = document.createElement("td");
        let phoneTextBox = document.createElement("input");
        phoneTextBox.setAttribute("type", "text");
        phoneTextBox.className = "form-control";
        phoneTextBox.value = contact.phone;
        phoneTextBox.addEventListener("change", () => {
            contact.phone = phoneTextBox.value;
            putContact(contact.id, contact);
        });
        phoneTd.appendChild(phoneTextBox);


        let salaryTd = document.createElement("td");
        let salaryNumberBox = document.createElement("input");
        salaryNumberBox.setAttribute("type", "number");
        salaryNumberBox.setAttribute("step", ".01");
        salaryNumberBox.className = "form-control";
        salaryNumberBox.value = contact.salary;
        salaryNumberBox.addEventListener("change", () => {
            contact.salary = salaryNumberBox.value;
            putContact(contact.id, contact);
        });
        salaryTd.appendChild(salaryNumberBox);


        tr.appendChild(tdButton);
        tr.appendChild(nameTd);
        tr.appendChild(bdateTd);
        tr.appendChild(marriedTd);
        tr.appendChild(phoneTd);
        tr.appendChild(salaryTd);

        tBody.appendChild(tr);
    });
}

function deleteContact(id) {
    document.getElementById("row" + id).remove();

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/contacts/${id}`);

    xhr.send();
}

function putContact(id, record) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/contacts/${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(record));
}

function setupSort() {

    [...document.getElementsByClassName("arrow-up")]
        .forEach((element) => element.addEventListener("click", (event) => {

            if (element.className.includes("enable")) {
                event.target.className = "arrow arrow-up arrow-up-disable";
                applySorting("asc.id");
            }
            else {
                [...document.getElementsByClassName("arrow-up-enable")]
                    .forEach((element) => element.className = "arrow arrow-up-disable");
                [...document.getElementsByClassName("arrow-down-enable")]
                    .forEach((element) => element.className = "arrow arrow-down-disable");

                event.target.className = "arrow arrow-up arrow-up-enable";
                applySorting(element.id);
            }

        }));

    [...document.getElementsByClassName("arrow-down")]
        .forEach((element) => element.addEventListener("click", (event) => {

            if (element.className.includes("enable")) {
                event.target.className = "arrow arrow-down arrow-down-disable";
                applySorting("asc.id");
            }
            else {
                [...document.getElementsByClassName("arrow-up-enable")]
                    .forEach((element) => element.className = "arrow arrow-up arrow-up-disable");
                [...document.getElementsByClassName("arrow-down-enable")]
                    .forEach((element) => element.className = "arrow arrow-down arrow-down-disable");

                event.target.className = "arrow arrow-down arrow-down-enable";
                applySorting(element.id);
            }

        }));
}

function applySorting(prompt) {
    let params = prompt.split('.');

    if (params.length != 2 || records.length == 0)
        return;

    let directionComparator = params[0] == "asc"
        ? (a, b) => (a < b ? -1 : a > b ? 1 : 0)
        : (a, b) => (a > b ? -1 : a < b ? 1 : 0);

    let propertyToCompare = undefined;

    let contactKeys = Object.keys(records[0]);
    for (let key of contactKeys) {
        if (key.substring(0, 2) == params[1]) {
            propertyToCompare = key;
            break;
        }
    }

    records.sort((elem1, elem2) => directionComparator(elem1[propertyToCompare], elem2[propertyToCompare]));

    showRecords(applyFilters());
}

function setupFilters() {
    if (records.length == 0)
        return;

    let filtersTRId = "filtersTR";
    let filtersTR = document.getElementById(filtersTRId);
    filtersTR.innerHTML = "";

    let createCheckbox = (changeHandler) => {
        let wrapper = document.createElement("div");
        wrapper.className = "d-flex justify-content-start";
        let checkbox = document.createElement("input");
        checkbox.className = "form-check";
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("change", changeHandler);

        let label = document.createElement("label");
        label.innerText = "Enable";

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        return wrapper;
    };

    filtersTR.appendChild(document.createElement("th"));



    let nameTh = document.createElement("th");
    let nameTextBox = document.createElement("input");
    nameTextBox.setAttribute("type", "text");
    nameTextBox.addEventListener("input", () => {
        filterValues.name = nameTextBox.value.toLowerCase();
        applyFilters();
    });
    nameTextBox.className = "form-control";
    nameTh.appendChild(nameTextBox);
    nameTh.appendChild(createCheckbox((e) => {
        activeFilters.name = e.target.checked;
        applyFilters();
    }));
    filtersTR.appendChild(nameTh);



    let bdateTh = document.createElement("th");

    let startDate = document.createElement("input");
    startDate.setAttribute("type", "text");
    startDate.setAttribute("placeholder", "From");
    startDate.setAttribute("onfocus", "(this.type='date')");
    startDate.setAttribute("onblur", "(this.type='text')");
    startDate.addEventListener("change", () => {
        filterValues.bdate.start = startDate.value;
        applyFilters();
    });
    startDate.className = "form-control";

    let endDate = document.createElement("input");
    endDate.setAttribute("type", "text");
    endDate.setAttribute("placeholder", "To");
    endDate.setAttribute("onfocus", "(this.type='date')");
    endDate.setAttribute("onblur", "(this.type='text')");
    endDate.addEventListener("change", () => {
        filterValues.bdate.end = endDate.value;
        applyFilters();
    });
    endDate.className = "form-control";

    bdateTh.appendChild(startDate);
    bdateTh.appendChild(endDate);
    bdateTh.appendChild(createCheckbox((e) => {
        activeFilters.bdate = e.target.checked;
        applyFilters();
    }));
    filtersTR.appendChild(bdateTh);



    let marriedTh = document.createElement("th");
    let marriedFlag = document.createElement("input");
    marriedFlag.setAttribute("type", "checkbox");
    marriedFlag.addEventListener("change", () => {
        filterValues.married = marriedFlag.checked;
        applyFilters();
    });
    marriedFlag.className = "form-check";
    marriedTh.appendChild(marriedFlag);
    marriedTh.appendChild(createCheckbox((e) => {
        activeFilters.married = e.target.checked;
        applyFilters();
    }));
    filtersTR.appendChild(marriedTh);



    let phoneTh = document.createElement("th");
    let phoneTextBox = document.createElement("input");
    phoneTextBox.setAttribute("type", "text");
    phoneTextBox.addEventListener("input", () => {
        filterValues.phone = phoneTextBox.value.toLowerCase();
        applyFilters();
    });
    phoneTextBox.className = "form-control";

    phoneTh.appendChild(phoneTextBox);
    phoneTh.appendChild(createCheckbox((e) => {
        activeFilters.phone = e.target.checked;
        applyFilters();
    }));
    filtersTR.appendChild(phoneTh);



    let salaryTh = document.createElement("th");

    let minSalary = document.createElement("input");
    minSalary.setAttribute("type", "number");
    minSalary.setAttribute("step", ".01");
    minSalary.setAttribute("placeholder", "Min");
    minSalary.addEventListener("change", () => {
        filterValues.salary.min = parseFloat(minSalary.value) || null;
        applyFilters();
    });
    minSalary.className = "form-control";

    let maxSalary = document.createElement("input");
    maxSalary.setAttribute("type", "number");
    maxSalary.setAttribute("step", ".01");
    maxSalary.setAttribute("placeholder", "Max");
    maxSalary.addEventListener("change", () => {
        filterValues.salary.max = parseFloat(maxSalary.value) || null;
        applyFilters();
    });
    maxSalary.className = "form-control";

    salaryTh.appendChild(minSalary);
    salaryTh.appendChild(maxSalary);
    salaryTh.appendChild(createCheckbox((e) => {
        activeFilters.salary = e.target.checked;
        applyFilters();
    }));
    filtersTR.appendChild(salaryTh);
}

function applyFilters() {
    let filtredRecords = records.filter((record) => {
        if (activeFilters.name && !record.name.toLowerCase().includes(filterValues.name)) {
            return false;
        }
        if (activeFilters.married && record.married != filterValues.married) {
            return false;
        }
        if (activeFilters.bdate &&
            ((filterValues.bdate.start && record.dateOfBirth < filterValues.bdate.start) ||
                (filterValues.bdate.end && record.dateOfBirth > filterValues.bdate.end))) {
            return false;
        }
        if (activeFilters.phone && !record.phone.toLowerCase().includes(filterValues.phone)) {
            return false;
        }
        if (activeFilters.salary &&
            ((filterValues.salary.min !== null && record.salary < filterValues.salary.min) ||
                (filterValues.salary.max !== null && record.salary > filterValues.salary.max))) {
            return false;
        }
        return true;
    });

    showRecords(filtredRecords);

    return filtredRecords;
}
