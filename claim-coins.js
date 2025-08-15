const puppeteer = require('puppeteer');

(async () => {
  const email = process.env.HTV_EMAIL;
  const password = process.env.HTV_PASSWORD;

  if (!email || !password) {
    console.error("HTV_EMAIL or HTV_PASSWORD not set");
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://hanime.tv/login', { waitUntil: 'networkidle2' });
    
    // Fill login form
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for login to finish
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Navigate to coins page
    await page.goto('https://hanime.tv/coins', { waitUntil: 'networkidle2' });

    // Click the claim button (update selector if necessary)
    const claimButton = await page.$('button.claim-button');
    if (claimButton) {
      await claimButton.click();
      console.log("Coins claimed successfully!");
    } else {
      console.log("No claim button found or already claimed.");
    }
  } catch (err) {
    console.error("Error during claiming:", err);
  } finally {
    await browser.close();
  }
})();
