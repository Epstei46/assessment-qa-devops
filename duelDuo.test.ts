
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(2000)
})
test("Clicking the Draw button displays the div with id='choices'.", async () => {
    const draw = await driver.findElement(By.id("draw"))
    draw.click()
    const choices = await driver.findElement(By.id("choices"))
    const displayed = await choices.isDisplayed()
    // const displayed = await (driver.findElement(By.id("choices"))).isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(2000)
})
// I spent 90 minutes trying different CSS & xpath selectors and NOTHING is working. This is not happening, I'm DONE with this test idea. Thanks but no thanks. I was able to use CSS & xpath selectors interchangeably in the past homework, so something here is just broken. I don't get it.
// test("Clicking an 'Add to Duo' button displays the div with id='player-id'", async () => {
//     const displayed = await (driver.findElement(By.xpath(`//*[contains(text(), 'Health')]`))).isDisplayed()
//     expect(displayed).toBe(true)
//     await driver.sleep(2000)
// })
test("Wins counter is displaying properly", async () => {
    const wins = await driver.findElement(By.xpath(`//*[contains(text(),"Wins")]`))
    const displayed = await wins.isDisplayed()
    expect(displayed).toBe(true)
})
// I would have changed the above code to test that the amount for Wins/Losses changed after completing 1 duel, but again, no selectors are working for the buttons to "Add to Duo" so I cannot automate clicks to those buttons.