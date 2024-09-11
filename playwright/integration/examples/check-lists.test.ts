import { test, expect } from '@playwright/test'

test.describe('Check-lists example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/check-lists')
  })

  test('checks the bullet when clicked', async ({ page }) => {
    const slateNodeElement = 'div[data-slate-node="element"]'

    expect(await page.locator(slateNodeElement).nth(3).textContent()).toBe(
      'Criss-cross!'
    )

    await expect(
      page.locator(slateNodeElement).nth(3).locator('span').nth(1)
    ).toHaveCSS('text-decoration-line', 'line-through')

    // Unchecking the checkboxes should un-cross the corresponding text.
    await page
      .locator(slateNodeElement)
      .nth(3)
      .locator('span')
      .nth(0)
      .locator('input')
      .uncheck()
    expect(await page.locator(slateNodeElement).nth(3).textContent()).toBe(
      'Criss-cross!'
    )
    await expect(
      page.locator(slateNodeElement).nth(3).locator('span').nth(1)
    ).toHaveCSS('text-decoration-line', 'none')

    await expect(page.locator('p[data-slate-node="element"]')).toHaveCount(2)
  })

  test.only('dragging selection into checkbox', async ({ page }) => {
    const slateNodeElement = '[data-slate-node="element"]'
    const slateNodeText = '[data-slate-node="text"]'

    const paragraph = page.locator(slateNodeElement).nth(0)
    const initialParagraphContent = await paragraph.textContent()
    const checklistItem = page.locator(slateNodeElement).nth(1)
    await expect.poll(() => page.evaluate(() => document.getSelection()!.anchorOffset)).toBe(0)
    await checklistItem.hover({ position: { x: 65, y: 5 } })
    await page.mouse.down()
    await expect.poll(() => page.evaluate(() => document.getSelection()!.anchorOffset)).toBe(5)
    await paragraph.hover({ position: { x: 20, y: 40 }})
    await expect.poll(() => page.evaluate(() => document.getSelection()!.toString()))
      .toMatch(/^haviors.+\n+Slide$/)
    await checklistItem.hover({ position: { x: 5, y: 5 } })
    await page.mouse.up()
    await expect.poll(() => page.evaluate(() => document.getSelection()!.toString())).toBe('Slide')
    await page.keyboard.press('Backspace')

    await expect(paragraph).toHaveText(initialParagraphContent!)
    await expect(checklistItem).toHaveText(' to the left.')
  })
})
