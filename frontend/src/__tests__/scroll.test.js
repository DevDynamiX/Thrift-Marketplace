// e2e/scroll.test.js
describe('Horizontal Scroll Test', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    it('should display recommended items and allow horizontal scrolling', async () => {
        // Navigate to Home Screen (replace with your navigation if needed)
        await element(by.id('HomeScreen')).tap();

        // Check if the recommended items row is visible
        await expect(element(by.id('recommendedRow'))).toBeVisible();

        // Scroll horizontally to the end of the row
        await element(by.id('recommendedScrollView')).scrollTo('right');

        // Optionally, check if the last item in the scroll view is now visible
        await expect(element(by.id('recommendedItem-9'))).toBeVisible(); // Replace with actual item ID
    });
});
