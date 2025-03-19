async function fetchFeedback() {
    console.log("🔄 Fetching feedback data...");
    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec");
        let data = await response.json();
        console.log("✅ Data received:", data);

        let tableBody = document.getElementById("feedbackContainer");
        tableBody.innerHTML = "";

        if (!Array.isArray(data)) {
            console.error("❌ Invalid data format:", data);
            tableBody.innerHTML = "<tr><td colspan='7'>⚠️ No valid data found.</td></tr>";
            return;
        }

        data.forEach(row => {
            let tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${row.uniqueID || "N/A"}</td>
                <td>${row.timestamp || "N/A"}</td>
                <td>${row.name || "N/A"}</td>
                <td>${row.mobile || "N/A"}</td>
                <td>${row.feedback || "N/A"}</td>
                <td>
                    <select id="status-${row.uniqueID}">
                        <option value="Pending" ${row.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Progress" ${row.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Resolved" ${row.status === "Resolved" ? "selected" : ""}>Resolved</option>
                    </select>
                </td>
                <td><button onclick="updateStatus('${row.uniqueID}')">Update</button></td>
            `;

            tableBody.appendChild(tr);
        });

        $('#feedbackTable').DataTable(); // Initialize sorting & filtering
    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
}

async function updateStatus(uniqueID) {
    let selectedStatus = document.getElementById(`status-${uniqueID}`).value;
    console.log(`🔄 Updating status for ${uniqueID} to ${selectedStatus}...`);

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueID: uniqueID, status: selectedStatus })
        });

        let result = await response.json();
        if (result.success) {
            alert(`✅ Feedback ${uniqueID} updated to ${selectedStatus}!`);
            fetchFeedback(); // Refresh table
        } else {
            alert(`❌ Update failed: ${result.message}`);
        }
    } catch (error) {
        console.error("❌ Error updating status:", error);
    }
}

function filterTable() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#feedbackContainer tr");

    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

document.addEventListener("DOMContentLoaded", fetchFeedback);
