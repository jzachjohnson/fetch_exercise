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
    while (bricks.length > 1) {
      const groupSize = bricks.length / 3
      const leftBricks = bricks.splice(0, groupSize)
      const rightBricks = bricks.splice(0, groupSize)
      const unweighedBricks = [...bricks]
      bricks = await scale.weighBricks(leftBricks, rightBricks, unweighedBricks)
    }
    const fakeBrick = bricks[0]
    console.log(`⚖️ Fake Brick = ${fakeBrick}`)

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

