document.addEventListener("DOMContentLoaded", function () {
    fetchFeedback();
    document.getElementById("searchInput").addEventListener("input", filterTable);
});

async function fetchFeedback() {
    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec");
        let data = await response.json();
        let tableBody = document.getElementById("feedbackContainer");
        tableBody.innerHTML = "";
        
        data.forEach(row => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.uniqueID}</td>
                <td>${row.timestamp}</td>
                <td>${row.name}</td>
                <td>${row.mobile}</td>
                <td>${row.feedback}</td>
                <td>
                    <select id="status-${row.uniqueID}" class="form-select">
                        <option value="Pending" ${row.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Progress" ${row.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Resolved" ${row.status === "Resolved" ? "selected" : ""}>Resolved</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-primary" onclick="updateStatus('${row.uniqueID}')">Update</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>Failed to load data.</td></tr>";
    }
}




async function updateStatus(uniqueID) {
    let selectedStatus = document.getElementById(`status-${uniqueID}`).value;
    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueID, status: selectedStatus })
        });
        let result = await response.json();
        if (result.success) {
            alert("Status updated successfully!");
            fetchFeedback();
        } else {
            alert("Failed to update status. Try again.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Error updating status.");
    }
}

function filterTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#feedbackContainer tr");
    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}
