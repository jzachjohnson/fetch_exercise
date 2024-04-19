import { By, WebDriver, until } from 'selenium-webdriver'

/**
 * Representation of the scale UI
 */
export default class Scale {
  private driver: WebDriver
  public numWeighs = 0
  public weighResults: string[] = []

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  /**
   * Clears the weighing scales by clicking the reset button.
   */
  private async clearScales(): Promise<void> {
    const resetButton = await this.driver.wait(until.elementLocated(By.xpath("//*[text()='Reset']")))
    resetButton.click()
  }

  /**
   * Sets the left bricks on the weighing scales
   * @param values - The weight of each brick in the left bowl
   */
  private async setLeftBricks(values: number[]): Promise<void> {
    for (let i = 0; i < values.length; i++) {
      const input = await this.driver.findElement(By.id(`left_${i}`))
      await input.sendKeys(values[i])
    }
  }

  /**
   * Sets the right bricks on the weighing scales
   * @param values - The weight of each brick in the right bowl
   */
  private async setRightBricks(values: number[]): Promise<void> {
    for (let i = 0; i < values.length; i++) {
      const input = await this.driver.findElement(By.id(`right_${i}`))
      await input.sendKeys(values[i])
    }
  }

  /**
   * Weighs the given bricks on the scale, returning one third of the bricks
   * that do not weigh the same as the others
   * @param bricks - The bricks to be weighed
   * @returns The set of bricks that contain the impostor brick
   */
  async findFakeBrick(inputBricks: number[]): Promise<number> {
    let bricks = [...inputBricks]
    while (bricks.length > 1) {
      const groupSize = bricks.length / 3
      const leftBricks = bricks.splice(0, groupSize)
      const rightBricks = bricks.splice(0, groupSize)
      const unweighedBricks = [...bricks]
      await this.setLeftBricks(leftBricks)
      await this.setRightBricks(rightBricks)
      if (await this.weighBricks() === '=') bricks = unweighedBricks
      else {
        await this.setLeftBricks(leftBricks)
        await this.setRightBricks(unweighedBricks)
        if (await this.weighBricks() === '=') bricks = rightBricks
        else bricks = leftBricks
      }
    }
    return bricks[0]
  }

  /**
   * Clicks the weigh button to weigh the bricks currently in the scale, then
   * fetches all the results. Also clears the scales after the weighing is done.
   * @returns a string representation of the result of the weighing (either =, <, or >)
   */
  private async weighBricks(): Promise<string> {
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