// Content script for Port Extractor Chrome Extension
// This script runs in the context of web pages and can extract port information

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractPorts') {
        try {
            const ports = extractPortsFromCurrentPage(request.selectedProtocols);
            sendResponse({ success: true, ports: ports });
        } catch (error) {
            console.error('Error extracting ports:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Keep the message channel open for async response
});

// Function to extract ports from the current page
function extractPortsFromCurrentPage(selectedProtocols = []) {
    const ports = [];
    
    try {
        // Find the table with Ant Design classes
        const table = document.querySelector('.ant-table-tbody');
        
        if (!table) {
            console.warn('Ant Design table not found');
            return [];
        }

        // Get all table rows
        const rows = table.querySelectorAll('tr.ant-table-row');
        
        if (rows.length === 0) {
            console.warn('No table rows found');
            return [];
        }

        // Extract ports from each row
        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            
            // The port is in the 5th column (index 4)
            // The protocol is in the 6th column (index 5)
            // Based on the HTML structure: ID, Menu, Enabled, Remark, Port, Protocol, Clients, Traffic, Duration
            if (cells.length >= 6) {
                const portCell = cells[4]; // 5th column (0-indexed)
                const protocolCell = cells[5]; // 6th column (0-indexed)
                
                const portText = portCell.textContent.trim();
                const protocolText = protocolCell.textContent.toLowerCase().trim();
                
                // Validate port number
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
        
        console.log('Extracted ports:', uniquePorts);
        return uniquePorts;
        
    } catch (error) {
        console.error('Error in extractPortsFromCurrentPage:', error);
        return [];
    }
}

// Alternative extraction method for different table structures
function extractPortsAlternativeMethod() {
    const ports = [];
    
    try {
        // Look for port numbers in all table cells
        const allCells = document.querySelectorAll('td');
        
        for (const cell of allCells) {
            const cellText = cell.textContent.trim();
            
            // Look for port-like numbers (1-65535)
            const portMatch = cellText.match(/^\d+$/);
            if (portMatch) {
                const portNumber = parseInt(portMatch[0], 10);
                if (portNumber >= 1 && portNumber <= 65535) {
                    // Additional validation: check if this cell might be a port
                    // Look for common port indicators in nearby cells or headers
                    const row = cell.closest('tr');
                    if (row) {
                        const rowText = row.textContent.toLowerCase();
                        if (rowText.includes('port') || rowText.includes('tcp') || rowText.includes('udp') || 
                            rowText.includes('vless') || rowText.includes('protocol')) {
                            ports.push(portMatch[0]);
                        }
                    }
                }
            }
        }
        
        // Remove duplicates but keep original order (no sorting)
        const uniquePorts = [...new Set(ports)];
        
        return uniquePorts;
        
    } catch (error) {
        console.error('Error in extractPortsAlternativeMethod:', error);
        return [];
    }
}

// Function to highlight extracted ports (optional feature)
function highlightPorts(ports) {
    if (!ports || ports.length === 0) return;
    
    try {
        const portCells = document.querySelectorAll('.ant-table-tbody td');
        
        for (const cell of portCells) {
            const cellText = cell.textContent.trim();
            if (ports.includes(cellText)) {
                cell.style.backgroundColor = '#e6f7ff';
                cell.style.border = '2px solid #1890ff';
                cell.style.borderRadius = '4px';
            }
        }
    } catch (error) {
        console.error('Error highlighting ports:', error);
    }
}

// Auto-detect and extract ports when page loads (optional)
function autoDetectPorts() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(autoDetectPorts, 1000);
        });
        return;
    }
    
    // Check if this looks like a page with port information
    const hasPortTable = document.querySelector('.ant-table-tbody') !== null;
    const hasPortKeyword = document.body.textContent.toLowerCase().includes('port');
    
    if (hasPortTable && hasPortKeyword) {
        const ports = extractPortsFromCurrentPage();
        if (ports.length > 0) {
            // Store the detected ports
            chrome.storage.local.set({ 
                autoDetectedPorts: ports,
                autoDetectedUrl: window.location.href,
                autoDetectedTime: new Date().toISOString()
            });
            
            console.log('Auto-detected ports:', ports);
        }
    }
}

// Initialize auto-detection
autoDetectPorts(); 