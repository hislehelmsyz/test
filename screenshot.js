const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

// Create the screenshot directory if it doesn't exist
const screenshotDir = path.join(__dirname, 'screenshot');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

(async () => {
    const numberOfBrowsers = 16; // Number of browser instances you want to launch

    for (let i = 0; i < numberOfBrowsers; i++) {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled'
            ],
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Windows Chrome path
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'zh-CN,zh;q=0.9'
        });

        await page.goto('https://www.qq1.one/user/findpwd.php', {
            waitUntil: 'networkidle2'
        });

        // Wait for 5 seconds before taking the screenshot
        await page.waitForTimeout(5000);

        // Take a screenshot and save it in the screenshot folder
        await page.screenshot({ path: path.join(screenshotDir, `screenshot_${i + 1}.png`), fullPage: true });

        await browser.close();
    }
})();
