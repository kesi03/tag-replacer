using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace TagReplacer.Utils
{
    public static class TagReplacer
    {
        public static void ReplaceTags(Options options)
        {
            var replacerData = LoadReplacer(options.Replacer, options.Type, options.Format);
            if (replacerData == null) return;

            string content;
            try
            {
                content = File.ReadAllText(options.Infile);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading input file: {e.Message}");
                return;
            }

            foreach (var item in replacerData["replace"])
            {
                string key = item["key"];
                string value = item["value"];
                content = content.Replace($"{options.StartTag}{key}{options.EndTag}", value);
            }

            try
            {
                File.WriteAllText(options.Outfile, content);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error writing to output file: {e.Message}");
            }
        }

        public static Dictionary<string, List<Dictionary<string, string>>> LoadReplacer(string replacer, string replacerType, string formatType)
        {
            return replacerType switch
            {
                "file" => LoadFromFile(replacer),
                "string" => LoadFromString(replacer, formatType),
                "environment" => LoadFromEnvironment(replacer),
                _ => throw new ArgumentException("Invalid replacer type. Use 'string', 'file', or 'environment'.")
            };
        }

        private static Dictionary<string, List<Dictionary<string, string>>> LoadFromFile(string filePath)
        {
            string fileExtension = Path.GetExtension(filePath).ToLower();
            try
            {
                return fileExtension switch
                {
                    ".json" => JsonSerializer.Deserialize<Dictionary<string, List<Dictionary<string, string>>>>(File.ReadAllText(filePath)),
                    ".csv" => LoadCsv(filePath),
                    ".yaml" or ".yml" => LoadYaml(filePath),
                    _ => throw new NotSupportedException("Unsupported file format. Please use JSON, CSV, or YAML.")
                };
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading replacer from file: {e.Message}");
                return null;
            }
        }

        private static Dictionary<string, List<Dictionary<string, string>>> LoadFromString(string replacer, string formatType)
        {
            try
            {
                return formatType switch
                {
                    "json" => JsonSerializer.Deserialize<Dictionary<string, List<Dictionary<string, string>>>>(replacer),
                    "yaml" => LoadYamlFromString(replacer),
                    "csv" => LoadCsvFromString(replacer),
                    _ => throw new ArgumentException("Invalid format type. Use 'json', 'yaml', or 'csv'.")
                };
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error decoding string: {e.Message}");
                return null;
            }
        }

        private static Dictionary<string, List<Dictionary<string, string>>> LoadFromEnvironment(string replacer)
        {
            var replacerData = new Dictionary<string, List<Dictionary<string, string>>> { { "replace", new List<Dictionary<string, string>>() } };
            foreach (var key in replacer.Split(','))
            {
                string value = Environment.GetEnvironmentVariable(key.Trim());
                if (value != null)
                {
                    replacerData["replace"].Add(new Dictionary<string, string> { { "key", key.Trim() }, { "value", value } });
                }
                else
                {
                    Console.WriteLine($"Warning: Environment variable '{key.Trim()}' not found.");
                }
            }
            return replacerData;
        }

        private static Dictionary<string, List<Dictionary<string, string>>> LoadCsv(string filePath)
        {
            var replacerData = new Dictionary<string, List<Dictionary<string, string>>> { { "replace", new List<Dictionary<string, string>>() } };
            try
            {
                var lines = File.ReadAllLines(filePath);
                var headers = lines[0].Split(',');
                for (int i = 1; i < lines.Length; i++)
                {
                    var values = lines[i].Split(',');
                    var item = new Dictionary<string, string>
            {
                { "key", values[Array.IndexOf(headers, "key")] },
                { "value", values[Array.IndexOf(headers, "value")] }
            };
                    replacerData["replace"].Add(item);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading CSV file: {e.Message}");
            }
            return replacerData;
        }

        private static Dictionary<string, List<Dictionary<string, string>>> LoadCsvFromString(string csvString)
        {
            var replacerData = new Dictionary<string, List<Dictionary<string, string>>> { { "replace", new List<Dictionary<string, string>>() } };
            try
            {
                var lines = csvString.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
                var headers = lines[0].Split(',');
                for (int i = 1; i < lines.Length; i++)
                {
                    var values = lines[i].Split(',');
                    var item = new Dictionary<string, string>
            {
                { "key", values[Array.IndexOf(headers, "key")] },
                { "value", values[Array.IndexOf(headers, "value")] }
            };
                    replacerData["replace"].Add(item);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading CSV string: {e.Message}");
            }
            return replacerData;
        }
        private static Dictionary<string, List<Dictionary<string, string>>> LoadYaml(string filePath)
        {
            var deserializer = new DeserializerBuilder().Build();
            try
            {
                var yamlData = deserializer.Deserialize<Dictionary<string, List<Dictionary<string, string>>>>(File.ReadAllText(filePath));
                return yamlData;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading YAML file: {e.Message}");
                return null;
            }
        }

    }
}
