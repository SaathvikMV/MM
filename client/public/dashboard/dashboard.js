document.addEventListener("DOMContentLoaded", function () {
  const userLink = document.querySelector(".nav-link.dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  userLink.addEventListener("click", function (e) {
    e.preventDefault();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (event) {
    const isClickInsideDropdown =
      dropdownMenu.contains(event.target) || userLink === event.target;
    if (!isClickInsideDropdown) {
      dropdownMenu.style.display = "none";
    }
  });
});

// Get references to the relevant elements
var sortSelect = document.getElementById("sort-select");
var hideOrNot = document.querySelector(".hide_or_not");

// Function to handle the change event of the sort-select dropdown
function handleSortSelectChange() {
  var selectedOption = sortSelect.value;

  // Check the selected option and hide/show the hideOrNot element accordingly
  if (selectedOption === "date_asc" || selectedOption === "date_dec") {
    hideOrNot.style.display = "none";
  } else {
    hideOrNot.style.display = "block";
  }
}

// Attach the event listener to the sort-select dropdown
// sortSelect.addEventListener("change", handleSortSelectChange);

// Store the initial data
// Store the initial data
var initialData = [];

// Get references to the relevant elements
var sortSelect = document.getElementById("sort-select");
var hideOrNot = document.querySelector(".hide_or_not");

// Function to handle the change event of the sort-select dropdown
function handleSortSelectChange() {
  var selectedOption = sortSelect.value;

  // Check the selected option and hide/show the hideOrNot element accordingly
  if (selectedOption === "date_asc" || selectedOption === "date_dec") {
    hideOrNot.style.display = "none";
  } else {
    hideOrNot.style.display = "block";
  }
}

// Attach the event listener to the sort-select dropdown
// sortSelect.addEventListener("change", handleSortSelectChange);

// Get the table rows and store the initial data
var tableRows = document.getElementById("table-data");
// console.log(tableRows.length);
if (tableRows.length > 0) {
  for (let i = 1; i < tableRows.length; i++) {
    con
    const item = {
      name: "",
      amount: "",
      date: "",
      category: "",
    };
    const tableData = tableRows[i].children;
    item.name = tableData[0].innerText;
    item.amount = tableData[1].innerText;
    item.date = tableData[2].innerText;
    item.date = new Date(item.date.replaceAll("/", "-"));
    item.category = tableData[3].innerText;
    initialData.push(item);
  }
} else {
  // Handle the case where there is no data in the table
  console.log("No data in the table.");
}

// Event listener for form submission
document
  .getElementsByClassName("hist-form")[0]
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // const filter = event.target.elements.sort_select.value;
    // console.log(filter);

    let items = [...initialData]; // Use a copy of the initial data

    // Apply filter based on date if selected
    // if (filter !== "date_asc" && filter !== "date_dec") {
    //   const data = event.target.elements.date_input.valueAsDate;
    //   if (data) {
    //     const selectedDate = data.toDateString();
    //     items = items.filter(
    //       (item) => item.date.toDateString() === selectedDate
    //     );
    //   }
    // }

    // // Apply sorting based on the selected filter
    // if (filter === "amount_asc") {
    //   items.sort((a, b) => a.amount - b.amount);
    // } else if (filter === "amount_dec") {
    //   items.sort((a, b) => b.amount - a.amount);
    // } else if (filter === "category") {
    //   items.sort((a, b) => a.category.localeCompare(b.category));
    // } else if (filter === "date_asc") {
    //   items.sort((a, b) => a.date.getTime() - b.date.getTime());
    // } else if (filter === "date_dec") {
    //   items.sort((a, b) => b.date.getTime() - a.date.getTime());
    // }

    const tbody = document.getElementsByTagName("tbody")[0];
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }

    if (items.length === 0) {
      document.getElementById("no-elements-message").innerText =
        "No elements found for this date.";
      document.getElementById("data-table").classList.add("hidden");
      document.getElementById("no_element").classList.remove("hidden");
    } else {
      document.getElementById("data-table").classList.remove("hidden");
      document.getElementById("no-elements-message").innerText = "";
      document.getElementById("no_element").classList.add("hidden");

      for (const item of items) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = item.name;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerText = item.amount;
        tr.appendChild(td2);
        const td3 = document.createElement("td");
        // ...
        td3.innerText = item.date.toLocaleDateString("zh-Hans-CN");
        tr.appendChild(td3);
        const td4 = document.createElement("td");
        td4.innerText = item.category;
        tr.appendChild(td4);
        tbody.appendChild(tr);
      }
    }
  });

// Event listener for "Show All" button
document
  .getElementsByClassName("mid_button")[1]
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Use the initialData to show all elements
    const items = [...initialData];

    const tbody = document.getElementsByTagName("tbody")[0];
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }

    if (items.length === 0) {
      document.getElementById("no-elements-message").innerText =
        "No elements found.";
      document.getElementById("data-table").classList.add("hidden");
      document.getElementById("no_element").classList.remove("hidden");
    } else {
      document.getElementById("data-table").classList.remove("hidden");
      document.getElementById("no-elements-message").innerText = "";
      document.getElementById("no_element").classList.add("hidden");

      for (const item of items) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = item.name;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerText = item.amount;
        tr.appendChild(td2);
        const td3 = document.createElement("td");
        td3.innerText = item.date.toLocaleDateString("zh-Hans-CN");
        tr.appendChild(td3);
        const td4 = document.createElement("td");
        td4.innerText = item.category;
        tr.appendChild(td4);
        tbody.appendChild(tr);
      }
    }
  });
