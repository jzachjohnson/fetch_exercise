import { Builder, By, WebDriver, until } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import Scale from './scale.js'

async function weighBars() {
  let driver: WebDriver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().addArguments("--headless"))
    .build()
  try {
    console.log('⚖️ Starting Exercise')
    await driver.get('http://sdetchallenge.fetch.com/')
    const scale = new Scale(driver)

    // Weigh
    let bricks = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const fakeBrick = await scale.findFakeBrick(bricks)
    console.log(`⚖️ Fake Brick #${fakeBrick} found in ${scale.numWeighs} attempts`)

    // Result
    await driver.findElement(By.id(`coin_${fakeBrick}`)).click()
    await driver.wait(until.alertIsPresent())
    let alert = await driver.switchTo().alert()
    let alertText = await alert.getText()
    console.log(`⚖️ ${alertText}`)

  } finally {
    await driver.quit()
  }
}

weighBars()

