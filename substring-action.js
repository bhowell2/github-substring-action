const core = require('@actions/core');

function run() {
  const value = core.getInput('value', {required: true});
  const failIfNotFound = core.getInput('fail_if_not_found', {required: true}).toLowerCase() === 'true';
  const defaultReturnValue = core.getInput('default_return_value', {required: false})
  const outputName = core.getInput('output_name', {required: true});

  const indexOfStr = core.getInput('index_of_str', {required: false});
  const lengthFromStart = core.getInput('length_from_start', {required: false});
  const lengthFromEnd = core.getInput('length_from_end', {required: false})

  try {
    let outputStr = null;
    if (indexOfStr !== undefined) {
      const pos = value.indexOf(indexOfStr);
      if (pos < 0) {  // no match was found
        if (failIfNotFound) {
          throw `Could not find '${indexOfStr}' in '${value}' with indexOf() check.`;
        } else {
          outputStr = defaultReturnValue;
        }
      } else {
        // this is the start position of the indexOfStr + the length (to find the remaining bit)
        outputStr = value.substr(pos + indexOfStr.length);
      }
    } else if (lengthFromStart !== undefined) {
      outputStr = value.substr(0, Number.parseInt(lengthFromStart))
    } else if (lengthFromEnd !== undefined) {
      let fromEndInt = Number.parseInt(lengthFromEnd);
      if (fromEndInt > value.length) {
        outputStr = value;
      } else {
        outputStr = value.substr(value.length - fromEndInt);
      }
    } else {
      // throw error
      throw "Inputs 'index_of_str', 'length_from_start', or 'length_from_end' were not provided."
    }
    core.setOutput(outputName, outputStr);
  } catch (err) {
    core.setFailed("Action failed with error: '" + err + "'");
  }
}

module.exports = run;