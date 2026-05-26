from playwright.sync_api import sync_playwright

def run_verification(page):
    # Base URL for local server
    url = "http://localhost:8000"

    breakpoints = [
        {"width": 320, "height": 568, "name": "mobile_small"},
        {"width": 768, "height": 1024, "name": "tablet"},
        {"width": 1200, "height": 800, "name": "desktop"}
    ]

    for bp in breakpoints:
        page.set_viewport_size({"width": bp["width"], "height": bp["height"]})
        page.goto(url)
        page.wait_for_timeout(1000)

        # Check for overflow
        scroll_width = page.evaluate("document.documentElement.scrollWidth")
        client_width = page.evaluate("document.documentElement.clientWidth")
        has_overflow = scroll_width > client_width

        print(f"Breakpoint {bp['name']} ({bp['width']}px): ScrollWidth={scroll_width}, ClientWidth={client_width}, Overflow={has_overflow}")

        # Take screenshot
        page.screenshot(path=f"/home/jules/verification/screenshots/verification_{bp['name']}.png", full_page=True)
        page.wait_for_timeout(500)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/videos")
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            context.close()
            browser.close()
