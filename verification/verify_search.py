from playwright.sync_api import sync_playwright
import time

def test_search_debounce():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("file:///app/index.html")

        # Wait for the search input to exist (it's hidden initially behind auth)
        page.wait_for_selector("#patientSearch", state="attached")

        # Type into the search box even if it's hidden to ensure it doesn't crash
        # (Though playwright fill requires element to be visible by default)
        # So we force show it or just use evaluate
        page.evaluate("document.getElementById('patientSearch').value = 'John'")
        page.evaluate("document.getElementById('patientSearch').dispatchEvent(new Event('input'))")

        # Wait a bit longer than the debounce time (300ms)
        time.sleep(1)

        # Take a screenshot to verify it visually didn't crash
        page.screenshot(path="/app/verification/search_debounce.png")
        print("Screenshot saved to /app/verification/search_debounce.png")

        browser.close()

if __name__ == "__main__":
    test_search_debounce()
