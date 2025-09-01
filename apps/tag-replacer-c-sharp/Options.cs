using CommandLine;

namespace TagReplacer
{
    public class Options
    {
        [Value(0, Required = true, HelpText = "Replacer JSON string, CSV file path, YAML file path, or comma-separated environment variable keys.")]
        public string Replacer { get; set; }

        [Option('t', "type", Required = false, Default = "string", HelpText = "Specify if replacer is a 'string', 'file', or 'environment'.")]
        public string Type { get; set; }

        [Option('f', "format", Required = false, Default = "json", HelpText = "Format of the replacer if it's a string.")]
        public string Format { get; set; }

        [Option('i', "in", Required = true, HelpText = "Input file path.")]
        public string Infile { get; set; }

        [Option('o', "out", Required = true, HelpText = "Output file path.")]
        public string Outfile { get; set; }

        [Option("start_tag", Required = false, Default = "{{", HelpText = "Start tag for placeholders.")]
        public string StartTag { get; set; }

        [Option("end_tag", Required = false, Default = "}}", HelpText = "End tag for placeholders.")]
        public string EndTag { get; set; }
    }
}
