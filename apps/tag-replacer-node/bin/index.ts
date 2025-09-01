import * as yargs from 'yargs';
import  ReplaceTagsManager from '../lib/replacer/index';
import { FormatType, ReplacerType } from '../lib/utils';

// Define the interface for the command-line arguments
interface Args {
    replacer: string;
    type: ReplacerType;
    format: FormatType;
    in: string; // Use 'infile' instead of 'in' to avoid conflicts with reserved keywords
    out: string; // Use 'outfile' instead of 'out' for clarity
    start_tag: string;
    end_tag: string;
}

const startTag = '{{';
const endTag = '}}';

const argv: Args = yargs
    .option('replacer', {
        alias: 'r',
        type: 'string',
        demandOption: true,
        describe: 'Replacer JSON string, CSV file path, YAML file path, or comma-separated environment variable keys'
    })
    .option('type', {
        alias: 't',
        type: 'string',
        choices: ['string', 'file', 'environment'],
        default: 'string',
        describe: "Specify if replacer is a 'string', 'file', or 'environment'"
    })
    .option('format', {
        type: 'string',
        choices: ['json', 'yaml', 'csv'],
        default: 'json',
        describe: "Format of the replacer if it's a string"
    })
    .option('in', {
        alias: 'i',
        type: 'string',
        demandOption: true,
        describe: 'Input file path'
    })
    .option('out', {
        alias: 'o',
        type: 'string',
        demandOption: true,
        describe: 'Output file path'
    })
    .option('start_tag', {
        type: 'string',
        default: startTag,
        describe: `Start tag for placeholders (default: "${startTag}")`
    })
    .option('end_tag', {
        type: 'string',
        default: endTag,
        describe: `End tag for placeholders (default: "${endTag}")`
    })
    .help()
    .argv as unknown as Args; // Cast argv to the Args interface

// Call the replaceTags method from ReplaceTagsManager with the parsed arguments
ReplaceTagsManager.replaceTags(argv.replacer, argv.type, argv.format, argv.in, argv.out, argv.start_tag, argv.end_tag);
