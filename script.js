async function fetchFeedback() {
  try {
    console.log("🔄 Fetching feedback...");

    let response = await fetch("https://script.google.com/macros/s/AKfycby1yrnBkSJST2HtBQUzool4XDOaA3m4rOp2bvd0XnzvxmLpDB7a-Fx3S0tVLeWerjoY/exec");
    console.log("📩 Response status:", response.status);

    let data = await response.json();
    console.log("✅ Data Received:", data);

    let tableBody = document.getElementById("feedbackContainer");
    if (!tableBody) {
      console.error("❌ Element with ID 'feedbackContainer' not found.");
      return;
    }

    if (!Array.isArray(data)) {
      console.error("❌ Invalid data format:", data);
      tableBody.innerHTML = "<tr><td colspan='7'>⚠️ No valid data found.</td></tr>";
      return;
    }

    let tableHTML = "";
    data.forEach(row => {
      tableHTML += `<tr>
        <td>${row.uniqueID || "N/A"}</td>
        <td>${row.timestamp || "N/A"}</td>
        <td>${row.name || "N/A"}</td>
        <td>${row.mobile || "N/A"}</td>
        <td>${row.feedback || "N/A"}</td>
        <td>${row.status || "N/A"}</td>
        <td>
          <button onclick="updateStatus('${row.uniqueID}', 'Resolved')">Resolve</button>
        </td>
      </tr>`;
    });

    tableBody.innerHTML = tableHTML;
    console.log("✅ Table updated successfully.");
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>⚠️ Failed to load data.</td></tr>";
  }
}

document.addEventListener("DOMContentLoaded", fetchFeedback);
