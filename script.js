async function fetchFeedback() {
    console.log("🔄 fetchFeedback() function triggered!");

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec", {
            cache: "no-cache"  // Ensure fresh data is fetched
        });

        console.log("📩 Response status:", response.status);

        let data = await response.json();
        console.log("✅ Data received from API:", data);

        let tableBody = document.getElementById("feedbackContainer");
        if (!tableBody) {
            console.error("❌ Table container missing.");
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            console.error("❌ Data format issue or empty response:", data);
            tableBody.innerHTML = "<tr><td colspan='7'>⚠️ No feedback data available.</td></tr>";
            return;
        }

        let tableHTML = data.map(row => `
            <tr>
                <td>${row.uniqueID || "N/A"}</td>
                <td>${row.timestamp || "N/A"}</td>
                <td>${row.name || "N/A"}</td>
                <td>${row.mobile || "N/A"}</td>
                <td>${row.feedback || "N/A"}</td>
                <td>${row.status || "N/A"}</td>
                <td><button onclick="updateStatus('${row.uniqueID}', 'Resolved')">Resolve</button></td>
            </tr>
        `).join('');

        tableBody.innerHTML = tableHTML;
        console.log("✅ Table updated successfully.");
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>⚠️ Failed to load data.</td></tr>";
    }
}

// Ensure the function runs on page load
document.addEventListener("DOMContentLoaded", fetchFeedback);
