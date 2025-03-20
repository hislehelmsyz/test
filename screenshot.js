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
    // **1. 启动一个全局浏览器**
    console.log('启动浏览器...');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Windows Chrome path
    });

    async function launchBrowserAndCapture(i) {
        while (true) {
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'zh-CN,zh;q=0.9'
            });

            console.log(`[${i}] 开始获取`);

            try {
                await page.goto('https://www.qq2.one/user/findpwd.php', {
                    waitUntil: 'networkidle2'
                });
                
                const qrcodeValue = await page.$eval('#qrimg', (el) => el.getAttribute('qrcode'));
                console.log(`[${i}] 获取结果: ${qrcodeValue}`);
            } catch (err) {
                console.log(`[${i}] 获取结果: 失败`);
            }
           
            await page.close();
        }
    }

    console.log('浏览器启动完成');


    const numberOfBrowsers = 16;
    const browserPromises = [];

    for (let i = 0; i < numberOfBrowsers; i++) {
        browserPromises.push(launchBrowserAndCapture(i));
    }

    await Promise.all(browserPromises);
})();
