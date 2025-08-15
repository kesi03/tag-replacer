import json
import argparse
import os
import csv
import yaml

def load_replacer(replacer, replacer_type, format_type):
    """
    Load the replacer data based on the specified type.

    Args:
        replacer (str): The replacer JSON string, file path, or environment variable keys.
        replacer_type (str): The type of replacer ('string', 'file', or 'environment').
        format_type (str): The format of the replacer if it's a string ('json', 'yaml', or 'csv').

    Returns:
        dict: A dictionary containing the keys and values for replacement.
    """
    if replacer_type == 'file':
        file_extension = os.path.splitext(replacer)[1].lower()
        try:
            if file_extension == '.json':
                with open(replacer, 'r') as f:
                    return json.load(f)
            elif file_extension == '.csv':
                return load_csv(replacer)
            elif file_extension in ['.yaml', '.yml']:
                with open(replacer, 'r') as f:
                    return yaml.safe_load(f)
            else:
                print("Unsupported file format. Please use JSON, CSV, or YAML.")
                return None
        except Exception as e:
            print(f"Error reading replacer from file: {e}")
            return None
    elif replacer_type == 'string':
        try:
            if format_type == 'json':
                return json.loads(replacer)
            elif format_type == 'yaml':
                return yaml.safe_load(replacer)
            elif format_type == 'csv':
                return load_csv_from_string(replacer)
            else:
                print("Invalid format type. Use 'json', 'yaml', or 'csv'.")
                return None
        except Exception as e:
            print(f"Error decoding string: {e}")
            return None
    elif replacer_type == 'environment':
        return load_environment(replacer)
    else:
        print("Invalid replacer type. Use 'string', 'file', or 'environment'.")
        return None

def load_csv(replacer):
    """
    Load the replacer data from a CSV file.

    Args:
        replacer (str): The path to the CSV file.

    Returns:
        dict: A dictionary containing the keys and values for replacement.
    """
    replacer_data = {"replace": []}
    try:
        with open(replacer, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                replacer_data["replace"].append({"key": row.get("key"), "value": row.get("value")})
    except Exception as e:
        print(f"Error reading CSV file: {e}")
    return replacer_data

def load_csv_from_string(replacer):
    """
    Load the replacer data from a CSV string.

    Args:
        replacer (str): The CSV string.

    Returns:
        dict: A dictionary containing the keys and values for replacement.
    """
    replacer_data = {"replace": []}
    try:
        reader = csv.DictReader(replacer.splitlines())
        for row in reader:
            replacer_data["replace"].append({"key": row.get("key"), "value": row.get("value")})
    except Exception as e:
        print(f"Error reading CSV string: {e}")
    return replacer_data

def load_environment(replacer):
    """
    Load the replacer data from environment variables.

    Args:
        replacer (str): A comma-separated string of environment variable keys.

    Returns:
        dict: A dictionary containing the keys and values for replacement.
    """
    replacer_data = {"replace": []}
    for key in replacer.split(','):
        value = os.getenv(key.strip())
        if value is not None:
            replacer_data["replace"].append({"key": key.strip(), "value": value})
        else:
            print(f"Warning: Environment variable '{key.strip()}' not found.")
    return replacer_data
def replace_tags(replacer, replacer_type, format_type, infile, outfile, start_tag, end_tag):
    """
    Replace tags in the input file based on the replacer data.

    Args:
        replacer (str): The replacer JSON string, file path, or environment variable keys.
        replacer_type (str): The type of replacer ('string', 'file', or 'environment').
        format_type (str): The format of the replacer if it's a string ('json', 'yaml', or 'csv').
        infile (str): The path to the input file containing placeholders.
        outfile (str): The path to the output file where modified content will be saved.
        start_tag (str): The start tag for placeholders.
        end_tag (str): The end tag for placeholders.
    """
    # Load the replacer data
    replacer_data = load_replacer(replacer, replacer_type, format_type)
    if replacer_data is None:
        return

    # Read the input file
    try:
        with open(infile, 'r') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading input file: {e}")
        return

    # Replace tags in the content
    for item in replacer_data.get("replace", []):
        key = item.get("key", "")
        value = item.get("value", "")
        content = content.replace(f"{start_tag}{key}{end_tag}", value)

    # Write the modified content to the output file
    try:
        with open(outfile, 'w') as f:
            f.write(content)
    except Exception as e:
        print(f"Error writing to output file: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Replace tags in a file based on a JSON, CSV, YAML, or environment replacer.")
    parser.add_argument("--replacer", required=True, help="Replacer JSON string, CSV file path, YAML file path, or comma-separated environment variable keys")
    parser.add_argument("--type", choices=['string', 'file', 'environment'], default='string', help="Specify if replacer is a 'string', 'file', or 'environment'")
    parser.add_argument("--format", choices=['json', 'yaml', 'csv'], default='json', help="Format of the replacer if it's a string")
    parser.add_argument("--in", dest="infile", required=True, help="Input file path")
    parser.add_argument("--out", dest="outfile", required=True, help="Output file path")
    parser.add_argument("--start_tag", default="{{", help="Start tag for placeholders (default: '{{')")
    parser.add_argument("--end_tag", default="}}", help="End tag for placeholders (default: '}}')")

    args = parser.parse_args()

    replace_tags(args.replacer, args.type, args.format, args.infile, args.outfile, args.start_tag, args.end_tag)
