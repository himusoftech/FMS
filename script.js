document.addEventListener("DOMContentLoaded", function () {
    fetchFeedback();
});

async function fetchFeedback() {
    const response = await fetch("AKfycbw2Ob9THl7wkuMvrZak7PvPPviLLUJcOaGSbt2msbwG4B3XmRTl8fKWcNuRKq7EJXIUjA");
    const data = await response.json();

    const tableBody = document.getElementById("feedbackContainer");
    tableBody.innerHTML = "";

    data.forEach(feedback => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${feedback["Unique ID"]}</td>
            <td>${feedback["Timestamp"]}</td>
            <td>${feedback["Name"]}</td>
            <td>${feedback["Mobile Number"]}</td>
            <td>${feedback["Feedback/Grievance"]}</td>
            <td>${feedback["Email"]}</td>
            <td>
                <select class="status-dropdown">
                    <option value="Pending" ${feedback["Status"] === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="In Process" ${feedback["Status"] === "In Process" ? "selected" : ""}>In Process</option>
                    <option value="Resolved" ${feedback["Status"] === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </td>
            <td>
                <select class="assigned-dropdown">
                    <option value="">Assign to...</option>
                    <option value="Revanna" ${feedback["Assigned To"] === "Revanna" ? "selected" : ""}>Revanna</option>
                    <option value="Gopinath" ${feedback["Assigned To"] === "Gopinath" ? "selected" : ""}>Gopinath</option>
                    <option value="Lokesh" ${feedback["Assigned To"] === "Lokesh" ? "selected" : ""}>Lokesh</option>
                    <option value="Ragvendra" ${feedback["Assigned To"] === "Ragvendra" ? "selected" : ""}>Ragvendra</option>

                </select>
            </td>
            <td><input type="text" class="resolution-input" value="${feedback["Resolution"] || ""}"></td>
            <td><button class="update-btn btn btn-primary">Update</button></td>
        `;

        row.querySelector(".assigned-dropdown").addEventListener("change", function () {
            row.querySelector(".status-dropdown").value = "In Process";
        });

        row.querySelector(".update-btn").addEventListener("click", async function () {
            const updatedFeedback = {
                uniqueID: feedback["Unique ID"],
                status: row.querySelector(".status-dropdown").value,
                assignedTo: row.querySelector(".assigned-dropdown").value,
                resolution: row.querySelector(".resolution-input").value
            };

            const response = await fetch("AKfycbw2Ob9THl7wkuMvrZak7PvPPviLLUJcOaGSbt2msbwG4B3XmRTl8fKWcNuRKq7EJXIUjA", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFeedback)
            });

            const result = await response.json();
            if (result.success) {
                alert("Feedback updated successfully!");
                fetchFeedback();
            } else {
                alert("Error updating feedback!");
            }
        });

        tableBody.appendChild(row);
    });
}
