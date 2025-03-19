async function fetchFeedback() {
    console.log("🚀 Using Test Data (Ignoring API)");

    let testData = [
        { "uniqueID": "FB-1001", "timestamp": "2025-03-18 15:09:00", "name": "Alice", "mobile": "9876543210", "feedback": "Test case 1", "status": "Pending" },
        { "uniqueID": "FB-1002", "timestamp": "2025-03-18 17:58:20", "name": "Bob", "mobile": "8765432109", "feedback": "Test case 2", "status": "Resolved" }
    ];

    let tableBody = document.getElementById("feedbackContainer");
    if (!tableBody) {
        console.error("❌ Table container not found!");
        return;
    }

    let tableHTML = testData.map(row => `
        <tr>
            <td>${row.uniqueID}</td>
            <td>${row.timestamp}</td>
            <td>${row.name}</td>
            <td>${row.mobile}</td>
            <td>${row.feedback}</td>
            <td>${row.status}</td>
            <td><button onclick="alert('Resolve ${row.uniqueID}')">Resolve</button></td>
        </tr>
    `).join('');

    tableBody.innerHTML = tableHTML;
    console.log("✅ Table updated successfully with test data.");
}

document.addEventListener("DOMContentLoaded", fetchFeedback);
