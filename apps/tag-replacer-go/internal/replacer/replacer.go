package replacer

import (
	"encoding/csv"
	"encoding/json"
	"errors"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

func ReplaceTags(input, rtype, format, infile, outfile, startTag, endTag string) error {
	data, err := LoadReplacer(input, rtype, format)
	if err != nil {
		return err
	}

	content, err := os.ReadFile(infile)
	if err != nil {
		return err
	}
	text := string(content)

	for _, item := range data.Replace {
		text = strings.ReplaceAll(text, startTag+item.Key+endTag, item.Value)
	}

	return os.WriteFile(outfile, []byte(text), 0644)
}

func loadJSONFile(path string) (*ReplaceData, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return loadJSONString(string(b))
}

func loadYAMLFile(path string) (*ReplaceData, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return loadYAMLString(string(b))
}

func loadCSVFile(path string) (*ReplaceData, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	reader := csv.NewReader(f)
	return parseCSV(reader)
}

func loadJSONString(s string) (*ReplaceData, error) {
	var data ReplaceData
	err := json.Unmarshal([]byte(s), &data)
	return &data, err
}

func loadYAMLString(s string) (*ReplaceData, error) {
	var data ReplaceData
	err := yaml.Unmarshal([]byte(s), &data)
	return &data, err
}

func loadCSVString(s string) (*ReplaceData, error) {
	reader := csv.NewReader(strings.NewReader(s))
	return parseCSV(reader)
}

func parseCSV(reader *csv.Reader) (*ReplaceData, error) {
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}
	if len(records) < 1 {
		return &ReplaceData{}, nil
	}

	headers := records[0]
	keyIdx, valIdx := -1, -1
	for i, h := range headers {
		if h == "key" {
			keyIdx = i
		} else if h == "value" {
			valIdx = i
		}
	}
	if keyIdx == -1 || valIdx == -1 {
		return nil, errors.New("CSV must contain 'key' and 'value' headers")
	}

	data := ReplaceData{}
	for _, row := range records[1:] {
		data.Replace = append(data.Replace, ReplaceItem{
			Key:   row[keyIdx],
			Value: row[valIdx],
		})
	}
	return &data, nil
}

func loadEnv(keys string) *ReplaceData {
	data := ReplaceData{}
	for _, key := range strings.Split(keys, ",") {
		key = strings.TrimSpace(key)
		val := os.Getenv(key)
		if val != "" {
			data.Replace = append(data.Replace, ReplaceItem{
				Key:   key,
				Value: val,
			})
		}
	}
	return &data
}