# Substring Action  
Retrieves a substring of some input and sets the specified output variable.
This variable can be accessed via `steps.<step_id>.outputs.<output_name>`.

## Building/Testing
`node_modules` are not checked into the repository, because `jest` is used - which has many more 
dependencies.

## Inputs
| name | description | required | default |
|------|-------------|----------|---------|
| value | Value that the substring will be obtained from. | true | - |
| output_name | The step's output variable name from which the substring may be obtained | true | substring |
| index_of_str | The string that is used in the (javascript) String.prototype.indexOf(index_of_str, str) query | false | - |
| length_from_start | Returns the substring of the specified length from the beginning. | false | - |
| length_from_end | Returns the substring of the specified length starting at the end. | false | - |
| fail_if_not_found | If `index_of_str` does not result in a match this will cause an error to be thrown. | false | true |
| default_return_value | If `index_of_str` fails then this value will be returned (if `fail_if_not_found = false`). | false | "" (empty string) |

If more than one of the substring inputs is provided, the order of precedence is: `index_of_str`, `length_from_start`, 
`length_from_end`.

## Outputs
`output_name` - this will be whatever value was provided as the `output_name` on the input or defaults to `substring`.

## Example Usage
```yaml
steps:
  - uses: bhowell2/github-substring-action@v1.0.0
    id: one
    with:
      value: "abc123"
      index_of_str: "ab"
# steps.one.outputs.substring = 'c123'
```

```yaml
steps:
  - uses: bhowell2/github-substring-action@v1.0.0
    id: two
    with:
      value: "abc123"
      index_of_str: "ab"
      length_from_start: 3
# steps.two.outputs.substring = 'c123' -- note length_from_start is ignored
```

```yaml
steps:
  - uses: bhowell2/github-substring-action@v1.0.0
    id: three
    with:
      value: "abc123"
      length_from_start: 3
# steps.three.outputs.substring = 'abc'
```

```yaml
steps:
  - uses: bhowell2/github-substring-action@v1.0.0
    id: four
    with:
      value: "abc123"
      length_from_end: 3
# steps.four.outputs.substring = '123'
```
