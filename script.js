document.getElementById("addBtn").addEventListener("click", function () {
    const name = document.getElementById("name");
    const age = document.getElementById("age");
    const position = document.getElementById("position");

    if (name.value === "" || age.value === "" || position.value === "") {
        alert("Please fill all fields!");
        return;
    }

    const table = document.querySelector("#employeeTable tbody");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${name.value}</td>
        <td>${age.value}</td>
        <td>${position.value}</td>
    `;

    table.appendChild(row);

    name.value = "";
    age.value = "";
    position.value = "";
});
