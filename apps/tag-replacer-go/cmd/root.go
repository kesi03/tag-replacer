package cmd

import (
	"fmt"
	"os"

	"tag-replacer-go/internal/replacer"

	"github.com/spf13/cobra"
)

var (
	replacerInput string
	replacerType  string
	formatType    string
	infile        string
	outfile       string
	startTag      string
	endTag        string
)

var rootCmd = &cobra.Command{
	Use:   "tag-replacer",
	Short: "Replace tags in a file using JSON, CSV, YAML, or environment variables",
	Run: func(cmd *cobra.Command, args []string) {
		err := replacer.ReplaceTags(replacerInput, replacerType, formatType, infile, outfile, startTag, endTag)
		if err != nil {
			fmt.Println("Error:", err)
			os.Exit(1)
		}
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.Flags().StringVar(&replacerInput, "replacer", "", "Replacer string, file path, or env keys")
	rootCmd.Flags().StringVar(&replacerType, "type", "string", "Type of replacer: string, file, environment")
	rootCmd.Flags().StringVar(&formatType, "format", "json", "Format if replacer is a string: json, yaml, csv")
	rootCmd.Flags().StringVar(&infile, "in", "", "Input file path")
	rootCmd.Flags().StringVar(&outfile, "out", "", "Output file path")
	rootCmd.Flags().StringVar(&startTag, "start_tag", "{{", "Start tag for placeholders")
	rootCmd.Flags().StringVar(&endTag, "end_tag", "}}", "End tag for placeholders")

	rootCmd.MarkFlagRequired("replacer")
	rootCmd.MarkFlagRequired("in")
	rootCmd.MarkFlagRequired("out")
}
