# Tag Replacer Script

This script replaces tags in a text file based on a specified replacer. The replacer can be provided in various formats, including JSON, CSV, YAML, or as environment variables.

## Features

- Supports JSON, CSV, YAML, and environment variable formats.
- Flexible command-line interface using `argparse`.
- Customizable start and end tags for placeholders.
- Easy to use for replacing placeholders in text files.

## Requirements

- Python 3.x
- PyYAML (for YAML support)

You can install PyYAML using pip:

```bash
pip install PyYAML
```
or
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Usage

Run the script using the following command:

```bash
python tag-replacer.py--replacer <replacer> --type <type> --format <format> --in <input_file> --out <output_file> --start_tag <start_tag> --end_tag <end_tag>
```

### Arguments

- `--replacer`: The replacer JSON string, CSV file path, YAML file path, or comma-separated environment variable keys.
- `--type`: Specify if the replacer is a `string`, `file`, or `environment`. Default is `string`.
- `--format`: Format of the replacer if it's a string. Options are `json`, `yaml`, or `csv`. Default is `json`.
- `--in`: Input file path containing the text with placeholders.
- `--out`: Output file path where the modified text will be saved.
- `--start_tag`: Start tag for placeholders. Default is `{{`.
- `--end_tag`: End tag for placeholders. Default is `}}`.

## Examples

### 1. Using a JSON String

Replace tags using a JSON string directly:

```bash
python tag-replacer.py--replacer '{"replace":[{"key":"name","value":"John Doe"},{"key":"age","value":"30"}]}' --type string --format json --in input.txt --out output.txt
```

### 2. Using a JSON File

Replace tags using a JSON file:

```bash
python tag-replacer.py--replacer replacer.json --type file --in input.txt --out output.txt
```

### 3. Using a CSV File

Create a CSV file (e.g., `replacer.csv`) with the following format:

```
key,value
name,John Doe
age,30
```

Run the script:

```bash
python tag-replacer.py--replacer replacer.csv --type file --in input.txt --out output.txt
```

### 4. Using a YAML File

Create a YAML file (e.g., `replacer.yaml`) with the following format:

```yaml
replace:
  - key: name
    value: John Doe
  - key: age
    value: "30"
```

Run the script:

```bash
python tag-replacer.py--replacer replacer.yaml --type file --in input.txt --out output.txt
```

### 5. Using Environment Variables

Set environment variables in your shell:

```bash
export NAME="John Doe"
export AGE="30"
```

Run the script with environment variable keys:

```bash
python tag-replacer.py--replacer "NAME,AGE" --type environment --in input.txt --out output.txt
```

### 6. Custom Start and End Tags

You can customize the start and end tags for placeholders. For example, if you want to use `[[` and `]]` as tags:

```bash
python tag-replacer.py--replacer '{"replace":[{"key":"name","value":"John Doe"},{"key":"age","value":"30"}]}' --type string --format json --in input.txt --out output.txt --start_tag "[[" --end_tag "]]"
```

## Input File Example

The input file (`input.txt`) can contain placeholders like this:

```
Hello, my name is {{name}} and I am {{age}} years old.
```

## Output

The output file will contain the replaced values based on the specified replacer.

```
Hello, my name is John Doe and I am 30 years old.
```

## License

This project is licensed under the MIT License.
```
