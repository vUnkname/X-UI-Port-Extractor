document.addEventListener("DOMContentLoaded", function () {
    const refreshBtn = document.getElementById("refreshBtn");
    const copyBtn = document.getElementById("copyBtn");
    const portsTextarea = document.getElementById("portsTextarea");
    const statusMessage = document.getElementById("statusMessage");
    const enableCustomText = document.getElementById("enableCustomText");
    const optionsSection = document.querySelector(".options-section");
    const prefixRadio = document.getElementById("prefixRadio");
    const postfixRadio = document.getElementById("postfixRadio");
    const customText = document.getElementById("customText");
    const actionBtns = document.querySelectorAll(".action-btn");
    const sponsorMessageElement = document.getElementById("sponsor-message");

    // Clear textarea on popup open
    portsTextarea.value = "";

    // Initially disable copy button
    copyBtn.disabled = true;
    if (actionBtns.length >= 2) {
        actionBtns[1].style.opacity = "0.5";
        actionBtns[1].style.pointerEvents = "none";
    }

    // Handle action buttons in textarea
    if (actionBtns.length >= 2) {
        actionBtns[0].addEventListener("click", extractPorts); // Refresh button
        actionBtns[1].addEventListener("click", copyToClipboard); // Copy button
    }

    // Fetch and display sponsor message
    fetchSponsorMessage();

    function fetchSponsorMessage() {
        fetch(
            "https://raw.githubusercontent.com/vUnkname/X-UI-Port-Extractor/main/assets/sponsor-messsage.json"
        )
            .then((response) => response.text())
            .then((text) => {
                // Only display if content is not empty
                if (text && text.trim() !== "") {
                    sponsorMessageElement.innerHTML = text;
                    sponsorMessageElement.style.display = "block";
                } else {
                    sponsorMessageElement.style.display = "none";
                }
            })
            .catch((error) => {
                console.error("Error fetching sponsor message:", error);
                sponsorMessageElement.style.display = "none";
            });
    }

    // Handle checkbox change
    function handleCheckboxChange() {
        const isEnabled = enableCustomText.checked;

        if (isEnabled) {
            optionsSection.classList.remove("disabled");
        } else {
            optionsSection.classList.add("disabled");
            customText.value = "";
        }

        handleRadioChange();
    }

    // Handle radio button changes
    function handleRadioChange() {
        const isCheckboxEnabled = enableCustomText.checked;
        const needsCustomText = prefixRadio.checked || postfixRadio.checked;

        customText.disabled = !isCheckboxEnabled || !needsCustomText;

        if (!isCheckboxEnabled || !needsCustomText) {
            customText.value = "";
        }
    }

    // Add event listeners
    enableCustomText.addEventListener("change", handleCheckboxChange);
    prefixRadio.addEventListener("change", handleRadioChange);
    postfixRadio.addEventListener("change", handleRadioChange);

    // Show status message
    function showStatus(message, type = "info") {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;

        // Clear message after 3 seconds
        setTimeout(() => {
            statusMessage.textContent = "";
            statusMessage.className = "status-message";
        }, 3000);
    }

    // Extract ports from page
    async function extractPorts() {
        try {
            refreshBtn.classList.add("loading");
            if (actionBtns.length >= 1) actionBtns[0].classList.add("loading");
            showStatus("Extracting ports...", "info");

            // Get selected protocol filters
            const selectedProtocols = [];
            const protocolCheckboxes = document.querySelectorAll(
                '.protocol-checkbox input[type="checkbox"]:checked'
            );
            protocolCheckboxes.forEach((checkbox) => {
                selectedProtocols.push(checkbox.value);
            });

            // Get active tab
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });

            // Execute content script to extract ports
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractPortsFromPage,
                args: [selectedProtocols],
            });

            const ports = results[0].result;

            if (ports && ports.length > 0) {
                // Display ports in textarea (each port on a new line)
                portsTextarea.value = ports.join("\n");
                copyBtn.disabled = false;
                if (actionBtns.length >= 2) {
                    actionBtns[1].style.opacity = "1";
                    actionBtns[1].style.pointerEvents = "auto";
                }

                let statusMsg = `${ports.length} ports extracted successfully`;
                if (selectedProtocols.length > 0) {
                    statusMsg += ` (filtered out: ${selectedProtocols.join(", ")})`;
                }
                showStatus(statusMsg, "success");

                // Save to storage after successful extraction
                chrome.storage.local.set({ extractedPorts: ports });
            } else {
                portsTextarea.value = "";
                copyBtn.disabled = true;
                if (actionBtns.length >= 2) {
                    actionBtns[1].style.opacity = "0.5";
                    actionBtns[1].style.pointerEvents = "none";
                }
                showStatus("No ports found on this page", "error");
            }
        } catch (error) {
            console.error("Error extracting ports:", error);
            showStatus("Error extracting ports from page", "error");
            portsTextarea.value = "";
            copyBtn.disabled = true;
            if (actionBtns.length >= 2) {
                actionBtns[1].style.opacity = "0.5";
                actionBtns[1].style.pointerEvents = "none";
            }
        } finally {
            refreshBtn.classList.remove("loading");
            if (actionBtns.length >= 1) actionBtns[0].classList.remove("loading");
        }
    }

    // Copy ports to clipboard
    async function copyToClipboard() {
        try {
            const text = portsTextarea.value.trim();
            if (!text) {
                showStatus("No ports available to copy", "error");
                return;
            }

            // Get ports array
            const ports = text.split("\n").filter((port) => port.trim() !== "");
            let finalPorts = [...ports];

            // Apply prefix or postfix based on selection
            const customTextValue = customText.value.trim();
            const isCustomTextEnabled = enableCustomText.checked;

            if (isCustomTextEnabled && customTextValue) {
                if (prefixRadio.checked) {
                    finalPorts = ports.map((port) => `${customTextValue}:${port}`);
                } else if (postfixRadio.checked) {
                    finalPorts = ports.map((port) => `${port}:${customTextValue}`);
                }
            }

            // Convert to comma-separated format
            const commaSeparated = finalPorts.join(",");

            await navigator.clipboard.writeText(commaSeparated);

            let statusMsg = "Ports copied to clipboard successfully";
            if (isCustomTextEnabled && customTextValue) {
                if (prefixRadio.checked) {
                    statusMsg = `Ports copied with prefix "${customTextValue}"`;
                } else if (postfixRadio.checked) {
                    statusMsg = `Ports copied with postfix "${customTextValue}"`;
                }
            }

            showStatus(statusMsg, "success");
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            // Fallback for older browsers
            try {
                // Get ports array
                const ports = portsTextarea.value
                    .split("\n")
                    .filter((port) => port.trim() !== "");
                let finalPorts = [...ports];

                // Apply prefix or postfix based on selection
                const customTextValue = customText.value.trim();
                const isCustomTextEnabled = enableCustomText.checked;

                if (isCustomTextEnabled && customTextValue) {
                    if (prefixRadio.checked) {
                        finalPorts = ports.map((port) => `${customTextValue}:${port}`);
                    } else if (postfixRadio.checked) {
                        finalPorts = ports.map((port) => `${port}:${customTextValue}`);
                    }
                }

                // Create temporary textarea with comma-separated format
                const tempTextarea = document.createElement("textarea");
                tempTextarea.value = finalPorts.join(",");
                document.body.appendChild(tempTextarea);
                tempTextarea.select();
                document.execCommand("copy");
                document.body.removeChild(tempTextarea);

                let statusMsg = "Ports copied to clipboard successfully";
                if (isCustomTextEnabled && customTextValue) {
                    if (prefixRadio.checked) {
                        statusMsg = `Ports copied with prefix "${customTextValue}"`;
                    } else if (postfixRadio.checked) {
                        statusMsg = `Ports copied with postfix "${customTextValue}"`;
                    }
                }

                showStatus(statusMsg, "success");
            } catch (fallbackError) {
                showStatus("Failed to copy ports to clipboard", "error");
            }
        }
    }

    // Event listeners for main buttons
    refreshBtn.addEventListener("click", extractPorts);
    copyBtn.addEventListener("click", copyToClipboard);

    // Initialize states
    handleCheckboxChange();
    handleRadioChange();
});

// Function to be executed in the content script context
function extractPortsFromPage(selectedProtocols = []) {
    try {
        const ports = [];

        // Find the table with Ant Design classes
        const table = document.querySelector(".ant-table-tbody");

        if (!table) {
            console.warn("Table not found");
            return [];
        }

        // Get all table rows
        const rows = table.querySelectorAll("tr.ant-table-row");

        for (const row of rows) {
            // Get all cells in the row
            const cells = row.querySelectorAll("td");

            // The port is in the 5th column (index 4)
            // The protocol is in the 6th column (index 5)
            // Based on the HTML structure: ID, Menu, Enabled, Remark, Port, Protocol, Clients, Traffic, Duration
            if (cells.length >= 6) {
                const portCell = cells[4]; // 5th column (0-indexed)
                const protocolCell = cells[5]; // 6th column (0-indexed)

                const portText = portCell.textContent.trim();
                const protocolText = protocolCell.textContent.toLowerCase().trim();

                // Check if it's a valid port number (numeric and reasonable range)
                if (portText && /^\d+$/.test(portText)) {
                    const portNumber = parseInt(portText, 10);
                    if (portNumber >= 1 && portNumber <= 65535) {
                        // Check if this port should be filtered out based on protocol
                        let shouldSkip = false;

                        if (selectedProtocols.length > 0) {
                            // Check if the protocol matches any of the selected filters
                            for (const protocol of selectedProtocols) {
                                if (protocolText.includes(protocol.toLowerCase())) {
                                    shouldSkip = true;
                                    break;
                                }
                            }
                        }

                        // Only add port if it's not filtered out
                        if (!shouldSkip) {
                            ports.push(portText);
                        }
                    }
                }
            }
        }

        // Remove duplicates but keep original order (no sorting)
        const uniquePorts = [...new Set(ports)];

        return uniquePorts;
    } catch (error) {
        console.error("Error in extractPortsFromPage:", error);
        return [];
    }
}
