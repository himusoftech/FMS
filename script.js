document.addEventListener("DOMContentLoaded", function () {
    fetchFeedback();
});

// ✅ Fetch feedback data from Google Sheets
async function fetchFeedback() {
    try {
        let response = await fetch("AKfycbxd9DkgPgeD3IasHHg612ISVJSEVQq-oFqU5t3FEhEbGnGTVUSPGi5HusVZHqv0vBFm");
        let data = await response.json();

        let tableBody = document.getElementById("feedbackContainer");
        tableBody.innerHTML = "";

        data.forEach(feedback => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${feedback.uniqueID}</td>
                <td>${feedback.timestamp}</td>
                <td>${feedback.name}</td>
                <td>${feedback.mobile}</td>
                <td>${feedback.feedback}</td>
                <td>
                    <select id="status-${feedback.uniqueID}" class="form-select">
                        <option value="Pending" ${feedback.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Progress" ${feedback.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Resolved" ${feedback.status === "Resolved" ? "selected" : ""}>Resolved</option>
                    </select>
                </td>
                <td>
                    <select id="assign-${feedback.uniqueID}" class="form-select">
                        <option value="">Assign to...</option>
                        <option value="Person A">Revanna</option>
                        <option value="Person B">Gopinath</option>
                        <option value="Person C">Lokesh</option>
                    </select>
                </td>
                <td>
                    <input type="text" id="resolution-${feedback.uniqueID}" class="form-control" placeholder="Enter resolution">
                </td>
                <td>
                    <button id="btn-${feedback.uniqueID}" class="btn btn-primary btn-sm" onclick="updateStatus('${feedback.uniqueID}')">Update</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("❌ Failed to load feedback data!");
    }
}

// ✅ Update status, assign person & send resolution
async function updateStatus(uniqueID) {
    let selectedStatus = document.getElementById(`status-${uniqueID}`).value;
    let assignedTo = document.getElementById(`assign-${uniqueID}`).value;
    let resolutionText = document.getElementById(`resolution-${uniqueID}`).value;
    let button = document.getElementById(`btn-${uniqueID}`);
    
    button.innerText = "Updating...";
    button.disabled = true;

    try {
        let response = await fetch("AKfycbxd9DkgPgeD3IasHHg612ISVJSEVQq-oFqU5t3FEhEbGnGTVUSPGi5HusVZHqv0vBFm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uniqueID: uniqueID,
                status: selectedStatus,
                assignedTo: assignedTo,
                resolution: resolutionText
            })
        });

        let result = await response.json();

        if (result.success) {
            alert("✅ Status updated successfully!");
            fetchFeedback(); // Reload table
        } else {
            alert("❌ Failed to update: " + result.message);
        }
    } catch (error) {
        console.error("Error updating:", error);
        alert("❌ Network error! Check console.");
    } finally {
        button.innerText = "Update";
        button.disabled = false;
    }
}

// ✅ Search feedback table
document.getElementById("searchInput").addEventListener("keyup", function () {
    let searchValue = this.value.toLowerCase();
    let rows = document.getElementById("feedbackContainer").getElementsByTagName("tr");

    Array.from(rows).forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchValue) ? "" : "none";
    });
});

// ✅ Sort table columns
function sortTable(columnIndex) {
    let table = document.getElementById("feedbackContainer");
    let rows = Array.from(table.getElementsByTagName("tr"));

    let sortedRows = rows.sort((a, b) => {
        let aText = a.cells[columnIndex]?.innerText.trim();
        let bText = b.cells[columnIndex]?.innerText.trim();

        if (!isNaN(Date.parse(aText)) && !isNaN(Date.parse(bText))) {
            return new Date(aText) - new Date(bText);
        }
        return aText.localeCompare(bText);
    });

    table.innerHTML = "";
    sortedRows.forEach(row => table.appendChild(row));
}
