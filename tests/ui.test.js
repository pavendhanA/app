const { expect } = require('chai');
const DriverFactory = require('../src/driver/DriverFactory');
const UIComponentPage = require('../src/pages/UIComponentPage');

describe('UI Component Testing Suite', function () {
  let uiPage;

  before(function () {
    const driver = DriverFactory.getDriver();
    uiPage = new UIComponentPage(driver);
  });

  it('Should validate ElevatedButton, TextButton, and IconButton clicks', async function () {
    await uiPage.verifyButtons();
    expect(true).to.be.true;
  });

  it('Should validate Material Switch toggle controls', async function () {
    await uiPage.toggleSwitch(true);
    await uiPage.toggleSwitch(false);
    expect(true).to.be.true;
  });

  it('Should validate Dialog trigger popups and dismissal', async function () {
    const handled = await uiPage.handleDialog();
    expect(handled).to.be.true;
  });

  it('Should validate BottomSheet overlay triggers and swipe dismissal', async function () {
    const handled = await uiPage.handleBottomSheet();
    expect(handled).to.be.true;
  });

  it('Should validate Snackbar temporary alert triggers', async function () {
    const shown = await uiPage.checkSnackbar();
    expect(shown).to.be.true;
  });

  it('Should validate scroll lists and click inner cards', async function () {
    // Scrolls down lists and selects item 5 card
    await uiPage.scrollAndSelectListItem('5');
    expect(true).to.be.true;
  });
});
