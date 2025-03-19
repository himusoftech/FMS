async function fetchFeedback() {
    console.log("🔄 Fetching data from API...");

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec");
        console.log("📩 Response status:", response.status);

        if (!response.ok) throw new Error("Server responded with status: " + response.status);

        let data = await response.json();
        console.log("✅ Data received:", data);

        let tableBody = document.getElementById("feedbackContainer");
        if (!tableBody) {
            console.error("❌ Table container not found!");
            return;
        }

        let tableHTML = data.map(row => `
            <tr>
                <td>${row.uniqueID || "N/A"}</td>
                <td>${row.timestamp || "N/A"}</td>
                <td>${row.name || "N/A"}</td>
                <td>${row.mobile ? row.mobile.toString() : "N/A"}</td>
                <td>${row.feedback || "N/A"}</td>
                <td>${row.status || "N/A"}</td>
                <td><button onclick="updateStatus('${row.uniqueID}', 'Resolved')">Resolve</button></td>
            </tr>
        `).join('');

        tableBody.innerHTML = tableHTML;
        console.log("✅ Table updated with API data.");
    } catch (error) {
        console.error("❌ Fetch error:", error);
        document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>⚠️ Failed to load data.</td></tr>";
    }
}

document.addEventListener("DOMContentLoaded", fetchFeedback);
