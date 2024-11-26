    // References to DOM elements
    const nameInput = document.getElementById("student-name");
    const idInput = document.getElementById("student-id");
    const emailInput = document.getElementById("email");
    const contactInput = document.getElementById("contact-no");
    const addButton = document.getElementById("add-btn");
    const recordsTable = document.getElementById("student-records");

    // Track current editing row
    let editingIndex = null;

    // Load records from local storage
    const loadRecords = () => {
      const records = JSON.parse(localStorage.getItem("students")) || [];
      recordsTable.innerHTML = "";
      records.forEach((record, index) => addRowToTable(record, index));
    };

    // Save records to local storage
    const saveRecords = () => {
      const rows = [...recordsTable.children];
      const records = rows.map(row => ({
        name: row.querySelector(".name").textContent,
        id: row.querySelector(".id").textContent,
        email: row.querySelector(".email").textContent,
        contact: row.querySelector(".contact").textContent,
      }));
      localStorage.setItem("students", JSON.stringify(records));
    };

    // Add row to table
    const addRowToTable = (record, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="name">${record.name}</td>
        <td class="id">${record.id}</td>
        <td class="email">${record.email}</td>
        <td class="contact">${record.contact}</td>
        <td>
          <button onclick="editRecord(${index})" class="btn">Edit</button>
          <button onclick="deleteRecord(${index})"class="btn">Delete</button>
        </td>
      `;
      recordsTable.appendChild(row);
    };

    // Validate inputs
    const validateInputs = () => {
      const nameRegex = /^[a-zA-Z\s]+$/;
      const idRegex = /^[0-9]+$/;
      const contactRegex = /^[0-9]{10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameRegex.test(nameInput.value)) {
        alert("Invalid name! Only characters are allowed.");
        return false;
      }
      if (!idRegex.test(idInput.value)) {
        alert("Invalid Student ID! Only numbers are allowed.");
        return false;
      }
      if (!emailRegex.test(emailInput.value)) {
        alert("Invalid Email!");
        return false;
      }
      if (!contactRegex.test(contactInput.value)) {
        alert("Invalid Contact Number! Must be 10 digits.");
        return false;
      }
      return true;
    };

    // Add or Update Record
    addButton.addEventListener("click", () => {
      if (!validateInputs()) return;

      const record = {
        name: nameInput.value.trim(),
        id: idInput.value.trim(),
        email: emailInput.value.trim(),
        contact: contactInput.value.trim(),
      };

      if (editingIndex !== null) {
        // Update existing record
        const rows = [...recordsTable.children];
        const row = rows[editingIndex];
        row.querySelector(".name").textContent = record.name;
        row.querySelector(".id").textContent = record.id;
        row.querySelector(".email").textContent = record.email;
        row.querySelector(".contact").textContent = record.contact;

        editingIndex = null;
      } else {
        // Add new record
        addRowToTable(record, recordsTable.children.length);
      }

      saveRecords();
      clearInputs();
    });

    // Edit Record
    window.editRecord = index => {
      const rows = [...recordsTable.children];
      const row = rows[index];
      nameInput.value = row.querySelector(".name").textContent;
      idInput.value = row.querySelector(".id").textContent;
      emailInput.value = row.querySelector(".email").textContent;
      contactInput.value = row.querySelector(".contact").textContent;

      editingIndex = index;
    };

    // Delete Record
    window.deleteRecord = index => {
      const rows = [...recordsTable.children];
      rows[index].remove();
      saveRecords();
    };

    // Clear Inputs
    const clearInputs = () => {
      nameInput.value = "";
      idInput.value = "";
      emailInput.value = "";
      contactInput.value = "";
    };

    // Load records on page load
    loadRecords();