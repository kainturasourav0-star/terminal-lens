/**
 * LinkedIn Auto-Connect Helper Script
 * 
 * INSTRUCTIONS:
 * 1. Open one of the LinkedIn search links in your browser:
 *    https://www.linkedin.com/search/results/people/?keywords=IGNOU%20%22Software%22%20OR%20%22Developer%22
 * 
 * 2. Press F12 (or right-click and select Inspect) to open Developer Tools.
 * 3. Go to the "Console" tab.
 * 4. Copy and paste this entire script and press Enter.
 * 5. Run: startAutoConnect()
 */

const messageTemplate = "Hi, I’m currently pursuing my BCA at IGNOU (2025-2028). I saw your profile and that you are working in software. I’m building projects in React, Electron, and Python, and would love to connect to learn from your career journey!";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startAutoConnect() {
    console.log("🚀 Starting LinkedIn Auto-Connect helper...");
    
    // 1. Find all buttons on the page
    const buttons = Array.from(document.querySelectorAll('button'));
    // Filter for buttons that say "Connect"
    const connectButtons = buttons.filter(btn => btn.innerText.trim() === "Connect");
    
    if (connectButtons.length === 0) {
        console.warn("⚠️ No 'Connect' buttons found on this page. Make sure you are on a LinkedIn search results page.");
        return;
    }
    
    console.log(`🔍 Found ${connectButtons.length} 'Connect' buttons on this page.`);
    
    for (let i = 0; i < connectButtons.length; i++) {
        const btn = connectButtons[i];
        
        // Find the person's name on the same card if possible
        const parentCard = btn.closest('.entity-result__item, .reusable-search__result-container');
        let name = "there";
        if (parentCard) {
            const nameElement = parentCard.querySelector('.entity-result__title-text a span[aria-hidden="true"], .app-shared-outline-helper');
            if (nameElement) {
                name = nameElement.innerText.split(' ')[0]; // Get first name
            }
        }
        
        console.log(`👉 Connecting with ${name}...`);
        btn.click();
        
        // Wait for modal to open
        await delay(1500);
        
        // Find "Add a note" button
        const addNoteBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Add a note"));
        if (addNoteBtn) {
            addNoteBtn.click();
            await delay(1000);
        }
        
        // Find the text area for the message
        const textArea = document.querySelector('textarea[name="message"]');
        if (textArea) {
            // Replace [Name] or generic greeting
            const personalizedMessage = messageTemplate.replace("Hi,", `Hi ${name},`);
            
            // Set the value
            textArea.value = personalizedMessage;
            // Trigger input event so LinkedIn registers the change
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            
            console.log(`✅ Pre-filled message for ${name}.`);
            
            // Wait for user to review and click send
            console.log("⏸️ Paused. Please review the message and click 'Send' in the LinkedIn modal.");
            console.log("This script will resume in 6 seconds to find the next person...");
            
            await delay(6000);
        } else {
            console.warn("❌ Could not find the message text area. Closing modal.");
            const closeModalBtn = document.querySelector('button[aria-label="Dismiss"]');
            if (closeModalBtn) closeModalBtn.click();
            await delay(1000);
        }
    }
    
    console.log("🏁 Finished processing all connect buttons on this page!");
}
