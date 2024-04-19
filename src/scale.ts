import { By, WebDriver, until } from 'selenium-webdriver'

export default class Scale {
  private driver: WebDriver
  public numWeighs = 0
  public weighResults: string[] = []

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  private async clearScales(): Promise<void> {
    const resetButton = await this.driver.wait(until.elementLocated(By.xpath("//*[text()='Reset']")))
    resetButton.click()
  }

  private async setLeftBricks(values: number[]): Promise<void> {
    for (let i = 0; i < values.length; i++) {
      const input = await this.driver.findElement(By.id(`left_${i}`))
      await input.sendKeys(values[i])
    }
  }

  private async setRightBricks(values: number[]): Promise<void> {
    for (let i = 0; i < values.length; i++) {
      const input = await this.driver.findElement(By.id(`right_${i}`))
      await input.sendKeys(values[i])
    }
  }

  async weighBricks(leftBricks: number[], rightBricks: number[], unweighedBricks: number[]): Promise<number[]> {
    await this.setLeftBricks(leftBricks)
    await this.setRightBricks(rightBricks)
    if (await this.weigh() === '=') return unweighedBricks
    else {
      await this.setLeftBricks(leftBricks)
      await this.setRightBricks(unweighedBricks)
      if (await this.weigh() === '=') return rightBricks
      else return leftBricks
    }
  }

  private async weigh(): Promise<string> {
    this.numWeighs++
    const weighButton = await this.driver.wait(until.elementLocated(By.id("weigh")))
    await weighButton.click()
    const weighResult = await this.driver.wait(until.elementLocated(By.xpath(`//*[@class='game-info'][1]/ol/li[${this.numWeighs}]`)))
    console.log(`⚖️ ${await weighResult.getText()}`)
    const resultIndicator = await this.driver.wait(until.elementLocated(By.xpath("//*[text()='Result']/following-sibling::*")))
    const result = await resultIndicator.getText()
    await this.clearScales()
    return result
  }
}