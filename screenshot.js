const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // 运行无头模式
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Windows 需要指定 Chrome 路径
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'zh-CN,zh;q=0.9'
    });
    
    await page.goto('https://www.qq1.one/user/findpwd.php', {
        waitUntil: 'networkidle2'
    });

    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    await browser.close();
})();
