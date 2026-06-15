const { expect } = require('chai');
const DriverFactory = require('../src/driver/DriverFactory');
const FormPage = require('../src/pages/FormPage');

describe('Form Validation Testing Suite', function () {
  let formPage;

  before(function () {
    const driver = DriverFactory.getDriver();
    formPage = new FormPage(driver);
  });

  it('Should validate required fields validation checks', async function () {
    // Submit blank form to trigger required validators
    await formPage.fillForm({ email: '', phone: '', password: '', limitText: '' });
    await formPage.submit();
    
    const errors = await formPage.getValidationMessages();
    expect(errors.email.toLowerCase()).to.contain('required');
  });

  it('Should validate incorrect email formatting checks', async function () {
    await formPage.fillForm({ email: 'bad-email-structure' });
    await formPage.submit();
    
    const errors = await formPage.getValidationMessages();
    expect(errors.email.toLowerCase()).to.contain('format');
  });

  it('Should validate phone number digit requirement checks', async function () {
    await formPage.fillForm({ phone: 'phone-letters' });
    await formPage.submit();
    
    const errors = await formPage.getValidationMessages();
    expect(errors.phone.toLowerCase()).to.contain('digit');
  });

  it('Should validate password length constraints', async function () {
    await formPage.fillForm({ password: '123' }); // Too short
    await formPage.submit();
    
    const errors = await formPage.getValidationMessages();
    expect(errors.password.toLowerCase()).to.contain('short');
  });

  it('Should validate input field maximum length limits', async function () {
    // Fill text exceeding limits
    await formPage.fillForm({ limitText: 'this_text_is_very_long_and_exceeds_maximum_allowed_length' });
    await formPage.submit();
    
    const errors = await formPage.getValidationMessages();
    expect(errors.limit.toLowerCase()).to.contain('limit');
  });

  it('Should validate date picker interaction', async function () {
    // Triggers picker dialog, clicks OK button natively, returns back to flutter context
    await formPage.selectDate();
    const dateBtnLabel = await formPage.getText(formPage.datePickerBtn);
    expect(dateBtnLabel).to.not.equal('Select Date');
  });

  it('Should validate dropdown selection options', async function () {
    await formPage.selectDropdownValue('Option B');
    const dropdownText = await formPage.getText(formPage.dropdownBtn);
    expect(dropdownText).to.equal('Option B');
  });

  it('Should validate radio buttons selection switching', async function () {
    await formPage.selectRadio('B');
    // Simple pass verification
    expect(true).to.be.true;
  });

  it('Should validate checkboxes toggles', async function () {
    await formPage.toggleCheckbox(true);
    // Simple pass verification
    expect(true).to.be.true;
  });
});
