const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw2Ob9THl7wkuMvrZak7PvPPviLLUJcOaGSbt2msbwG4B3XmRTl8fKWcNuRKq7EJXIUjA/exec"; // Replace with your actual URL

// Fetch feedback from Google Sheets and populate the table
async function fetchFeedback() {
    try {
        let response = await fetch(WEB_APP_URL);
        let data = await response.json();
         console.log("Fetched Data:", data);
        populateTable(data);
    } catch (error) {
        console.error("Error fetching feedback:", error);
    }
}
// Populate table with fetched feedback data
function populateTable(feedbackData) {
    let tableBody = document.getElementById("feedbackContainer");
    tableBody.innerHTML = ""; // Clear existing rows

    feedbackData.forEach(feedback => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${feedback["Unique ID"] || "N/A"}</td>
            <td>${feedback["Time Stamp"] || "N/A"}</td>
            <td>${feedback["Name"] || "N/A"}</td>
            <td>${feedback["Mobile Number"] || "N/A"}</td>
            <td>${feedback["Feedback/Grievance"] || "N/A"}</td>
            <td>${feedback["Email"] || "N/A"}</td>
            <td>
                <select id="assign-${feedback["Unique ID"]}">
                    <option value="">Assign</option>
                    <option value="Revanna" ${feedback["Assigned To"] === "Revanna" ? "selected" : ""}>Revanna</option>
                    <option value="Gopinath" ${feedback["Assigned To"] === "Gopinath" ? "selected" : ""}>Gopinath</option>
                    <option value="Lokesh" ${feedback["Assigned To"] === "Lokesh" ? "selected" : ""}>Lokesh</option>
                    <option value="Ragvendra" ${feedback["Assigned To"] === "Ragvendra" ? "selected" : ""}>Ragvendra</option>
                </select>
            </td>
            <td>
                <select id="status-${feedback["Unique ID"]}">
                    <option value="Pending" ${feedback["Status"] === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="In Process" ${feedback["Status"] === "In Process" ? "selected" : ""}>In Process</option>
                    <option value="Resolved" ${feedback["Status"] === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </td>
             <td>
                <input type="text" id="resolution-${feedback["Unique ID"]}" 
                       value="${feedback["Resolution"] || ""}" 
                       ${feedback["Status"] === "Resolved" ? "" : "disabled"}>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="updateFeedback('${feedback["Unique ID"]}')">Update</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Enable/Disable resolution input based on status selection
function toggleResolutionField(uin) {
    let statusField = document.getElementById(`status-${uin}`);
    let resolutionField = document.getElementById(`resolution-${uin}`);

    if (statusField.value === "Resolved") {
        resolutionField.removeAttribute("disabled");
    } else {
        resolutionField.setAttribute("disabled", "true");
    }
}


// Update feedback status in Google Sheets
async function updateFeedback(uin) {
    let assignedTo = document.getElementById(`assign-${uin}`).value;
    let status = document.getElementById(`status-${uin}`).value;
    let resolution = document.getElementById(`resolution-${uin}`).value;

    if (!assignedTo) {
        alert("Please assign a person before updating status.");
        return;
    }

    if (status === "Resolved" && !resolution) {
        alert("Please enter a resolution before marking as Resolved.");
        return;
    }

    try {
        let response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uin, assignedTo, status, resolution })
        });

        let result = await response.json();
        if (result.success) {
            alert("Feedback updated successfully!");
            fetchFeedback(); // Refresh the table
        } else {
            alert("Error updating feedback!");
        }
    } catch (error) {
        console.error("Error updating feedback:", error);
    }
}
