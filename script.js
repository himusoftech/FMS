async function fetchFeedback() {
    console.log("🔄 Fetching feedback data...");

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec");
        let data = await response.json();

        let tableBody = document.getElementById("feedbackContainer");
        if (!tableBody) {
            console.error("❌ Table container missing.");
            return;
        }

        if (!Array.isArray(data)) {
            console.error("❌ Data format issue:", data);
            tableBody.innerHTML = "<tr><td colspan='7'>⚠️ No valid data found.</td></tr>";
            return;
        }

        // Populate table
        let tableHTML = "";
        data.forEach(row => {
            tableHTML += `<tr>
                <td>${row.uniqueID || "N/A"}</td>
                <td>${row.timestamp || "N/A"}</td>
                <td>${row.name || "N/A"}</td>
                <td>${row.mobile || "N/A"}</td>
                <td>${row.feedback || "N/A"}</td>
                <td class="status">${row.status || "N/A"}</td>
                <td><button class="resolveBtn" data-id="${row.uniqueID}">Resolve</button></td>
            </tr>`;
        });

        tableBody.innerHTML = tableHTML;

        // Initialize DataTables for sorting and filtering
        $("#feedbackTable").DataTable();

        // Attach event listeners to resolve buttons
        document.querySelectorAll(".resolveBtn").forEach(button => {
            button.addEventListener("click", function () {
                let uniqueID = this.getAttribute("data-id");
                updateStatus(uniqueID, "Resolved", this);
            });
        });

        console.log("✅ Table updated successfully.");
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>⚠️ Failed to load data.</td></tr>";
    }
}

async function updateStatus(uniqueID, newStatus, buttonElement) {
    console.log(`🔄 Updating status for ${uniqueID}...`);

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueID, status: newStatus })
        });

        let result = await response.json();
        if (result.success) {
            console.log(`✅ Status updated for ${uniqueID}`);
            buttonElement.closest("tr").querySelector(".status").textContent = newStatus;
            buttonElement.disabled = true;
            buttonElement.textContent = "Resolved";
        } else {
            console.error("❌ Failed to update status:", result.message);
        }
    } catch (error) {
        console.error("❌ Error updating status:", error);
    }
}

// Run fetchFeedback on page load
document.addEventListener("DOMContentLoaded", fetchFeedback);
