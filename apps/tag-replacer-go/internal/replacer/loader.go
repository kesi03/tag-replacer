package replacer

import (
	"errors"
	"path/filepath"
	"strings"
)

type ReplaceItem struct {
	Key   string `json:"key" yaml:"key"`
	Value string `json:"value" yaml:"value"`
}

type ReplaceData struct {
	Replace []ReplaceItem `json:"replace" yaml:"replace"`
}

func LoadReplacer(input, rtype, format string) (*ReplaceData, error) {
	switch rtype {
	case "file":
		ext := strings.ToLower(filepath.Ext(input))
		switch ext {
		case ".json":
			return loadJSONFile(input)
		case ".yaml", ".yml":
			return loadYAMLFile(input)
		case ".csv":
			return loadCSVFile(input)
		default:
			return nil, errors.New("unsupported file format")
		}
	case "string":
		switch format {
		case "json":
			return loadJSONString(input)
		case "yaml":
			return loadYAMLString(input)
		case "csv":
			return loadCSVString(input)
		default:
			return nil, errors.New("invalid format type")
		}
	case "environment":
		return loadEnv(input), nil
	default:
		return nil, errors.New("invalid replacer type")
	}
}
