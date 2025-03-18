async function fetchFeedback() {
  try {
    let response = await fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_WEB_APP_URL/exec");
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
        <td>${row.uniqueID}</td>
        <td>${row.timestamp}</td>
        <td>${row.name}</td>
        <td>${row.mobile}</td>
        <td>${row.feedback}</td>
        <td>${row.status}</td>
        <td>
          <button onclick="updateStatus('${row.uniqueID}', 'Resolved')">Resolve</button>
        </td>
      </tr>`;
    });

    tableBody.innerHTML = tableHTML;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    document.getElementById("feedbackContainer").innerHTML = "<tr><td colspan='7'>⚠️ Failed to load data.</td></tr>";
  }
}

// Function to update feedback status
async function updateStatus(feedbackID, newStatus) {
  let response = await fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_WEB_APP_URL/exec", {
    method: "POST",
    body: JSON.stringify({ uniqueID: feedbackID, action: "updateStatus", status: newStatus }),
    headers: { "Content-Type": "application/json" }
  });

  let result = await response.json();
  if (result.success) {
    alert("✅ Status updated!");
    fetchFeedback(); // Refresh data
  } else {
    alert("❌ Error updating status!");
  }
}

window.onload = fetchFeedback;
