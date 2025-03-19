async function fetchFeedback() {
    console.log("🔄 Fetching feedback...");

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec");
        let data = await response.json();
        
        console.log("✅ Data received:", data);
        let tableBody = document.getElementById("feedbackContainer");
        tableBody.innerHTML = "";

        data.forEach(row => {
            let newRow = `<tr>
                <td>${row.uniqueID}</td>
                <td>${row.timestamp}</td>
                <td>${row.name}</td>
                <td>${row.mobile}</td>
                <td>${row.feedback}</td>
                <td>${row.status}</td>
                <td><button onclick="updateStatus('${row.uniqueID}')">Resolve</button></td>
            </tr>`;
            tableBody.innerHTML += newRow;
        });
    } catch (error) {
        console.error("❌ Error fetching feedback:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchFeedback);

async function updateStatus(uniqueID) {
    console.log(`🛠 Updating status for: ${uniqueID}`);

    try {
        let response = await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueID, status: "Resolved" })
        });

        let result = await response.json();
        console.log("✅ Update Response:", result);
        fetchFeedback(); // Refresh table after update
    } catch (error) {
        console.error("❌ Error updating status:", error);
    }
}

function sortTable(columnIndex) {
    let table = document.querySelector("table tbody");
    let rows = Array.from(table.rows);
    let sortedRows = rows.sort((a, b) => a.cells[columnIndex].innerText.localeCompare(b.cells[columnIndex].innerText));
    table.innerHTML = "";
    sortedRows.forEach(row => table.appendChild(row));
}

function filterTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#feedbackContainer tr");
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}
