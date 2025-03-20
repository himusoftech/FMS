async function fetchFeedback() {
    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycbxd9DkgPgeD3IasHHg612ISVJSEVQq-oFqU5t3FEhEbGnGTVUSPGi5HusVZHqv0vBFm/exec");
        if (!response.ok) throw new Error("Network response was not ok");
        let data = await response.json();

        let tableBody = document.getElementById("feedbackContainer");
        tableBody.innerHTML = ""; // Clear existing table data

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
                    <button class="btn btn-primary" id="btn-${row.uniqueID}" onclick="updateStatus('${row.uniqueID}')">Update</button>
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
    let button = document.getElementById(`btn-${uniqueID}`);

    button.innerText = "Updating...";
    button.disabled = true;

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycbxd9DkgPgeD3IasHHg612ISVJSEVQq-oFqU5t3FEhEbGnGTVUSPGi5HusVZHqv0vBFm/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueID, status: selectedStatus })
        });

        let result = await response.json();
        console.log("Server Response:", result); // Debugging

        if (result.success) {
            alert("Status updated successfully!");
            fetchFeedback(); // Reload table
        } else {
            alert("Failed to update: " + result.error);
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Network error while updating.");
    } finally {
        button.innerText = "Update";
        button.disabled = false;
    }
}
