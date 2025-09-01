using System;
using TagReplacer.Utils;

namespace TagReplacer
{
    class Program
    {
        static void Main(string[] args)
        {
            Parser.Default.ParseArguments<Options>(args)
                .WithParsed(options => TagReplacer.ReplaceTags(options));
        }
    }
}
