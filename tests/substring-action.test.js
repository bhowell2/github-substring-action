
const core = require('@actions/core');
const substringAction = require('../substring-action');

jest.mock('@actions/core')

function createRequireErrorMessage(key) {
  return `Input required and not supplied: ${key}.`
}

/*
* Need to re-throw the setFailed error, because there will be caught errors
* in the action (try-catch) that will only call setFailed, but not throw
* another error that the tests will detect.
* */
core.setFailed = jest.fn(arg => {
  throw arg;
})

/**
 * Should set the input variables for
 * @param obj
 * @return {function(*, *=): *}
 */
function setCoreGetInputMock(obj) {
  if (!obj.hasOwnProperty('index_of_str')) {
    obj['index_of_str'] = '';
  }
  if (!obj.hasOwnProperty('length_from_start')) {
    obj['length_from_start'] = '';
  }
  if (!obj.hasOwnProperty('length_from_end')) {
    obj['length_from_end'] = '';
  }  if (!obj.hasOwnProperty('output_name')) {
    obj['output_name'] = 'substring';
  }
  if (!obj.hasOwnProperty('fail_if_not_found')) {
    obj['fail_if_not_found'] = "true";
  }
  core.getInput = jest.fn((key, options) => {
    let val = obj[key];
    // same check for required as used in core code: https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts
    if (options && options.required && !val) {
      throw new Error(createRequireErrorMessage(key));
    }
    return val;
  });
}

describe('Check input variables.', () => {

  test("Should fail when 'value' is missing (or empty string).", () => {
    setCoreGetInputMock({});
    expect(substringAction).toThrow(createRequireErrorMessage("value"));

    setCoreGetInputMock({value: ""})
    expect(substringAction).toThrow(createRequireErrorMessage("value"));
  })

  test('Should fail when "output_name" is set to undefined or is empty.', () => {
    setCoreGetInputMock({value: "abc123", output_name: ""})
    expect(substringAction).toThrow(createRequireErrorMessage("output_name"));

    setCoreGetInputMock({value: "abc123", output_name: undefined})
    expect(substringAction).toThrow(createRequireErrorMessage("output_name"));
  })

  test("Should fail when index_of_str, length_from_start, or length_from_end are not provided.", () => {
    setCoreGetInputMock({value: "abc123"})
    expect(substringAction).toThrow("Inputs 'index_of_str', 'length_from_start', or 'length_from_end' were not provided.");
  })

})

function setCoreExpectedOutput(obj) {
  core.setOutput = jest.fn((key, val) => {
    let expectedVal = obj[key];
    if (expectedVal !== val) {
      // this in combination with the overridden setFailed will fail the tests when thrown
      throw new Error(`When setting the output the value (${val}) for '${key}' was not the expected value (${expectedVal}).`)
    }
  })
}

describe('Check returned substring', () => {

  test('Check substring from index_of_str output.', () => {
    setCoreGetInputMock({value: "abc123", index_of_str: "abc"})
    setCoreExpectedOutput({substring: "123"})
    substringAction();

    setCoreGetInputMock({value: "abc123", index_of_str: "abc123"})
    setCoreExpectedOutput({substring: ""})
    substringAction();

    setCoreGetInputMock({value: "abc123", index_of_str: "bc12"})
    setCoreExpectedOutput({substring: "3"})
    substringAction();

    // length_from_start should be ignored
    setCoreGetInputMock({value: "abc123", length_from_start: 1, index_of_str: "abc"})
    setCoreExpectedOutput({substring: "123"})
    substringAction();
  })

  test('Check substring when not found with index_of_str.', () => {
    setCoreGetInputMock({value: "abc123", index_of_str: "xyz", default_return_value: "not-found"})
    setCoreExpectedOutput({substring: "not-found"})
    expect(substringAction).toThrow(`Could not find 'xyz' in 'abc123' with indexOf() check.`);

    setCoreGetInputMock({value: "abc123", index_of_str: "xyz", fail_if_not_found: "false", default_return_value: "not-found"})
    setCoreExpectedOutput({substring: "not-found"})
    substringAction();
  })

  test('Check substring from length_from_start output.', () => {
    setCoreGetInputMock({value: "abc123", length_from_start: '1'})
    setCoreExpectedOutput({substring: "a"})
    substringAction();

    setCoreGetInputMock({value: "abc123", length_from_start: '5'})
    setCoreExpectedOutput({substring: "abc12"})
    substringAction();

    setCoreGetInputMock({value: "abc123", length_from_start: '10'})
    setCoreExpectedOutput({substring: "abc123"})
    substringAction();
  })

  test('Check substring from length_from_end output.', () => {
    // changing output name to ensure works.
    setCoreGetInputMock({value: "abc123", length_from_end: '3', output_name: "oo"})
    setCoreExpectedOutput({oo: "123"})
    substringAction();

    setCoreGetInputMock({value: "abc123", length_from_end: '10'})
    setCoreExpectedOutput({substring: "abc123"})
    substringAction();
  })

})
