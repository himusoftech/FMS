async function fetchFeedback() {
    try {
        let response = await fetch("https://script.google.com/macros/s/YOUR_UPDATED_DEPLOYMENT_ID/exec");
        if (!response.ok) throw new Error("Network response was not ok");
        
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
                <td>${row.status}</td>
                <td>
                    <select id="status-${row.uniqueID}" class="form-select">
                        <option value="Pending" ${row.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Progress" ${row.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Resolved" ${row.status === "Resolved" ? "selected" : ""}>Resolved</option>
                    </select>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>Failed to load data.</td></tr>";
    }
}
