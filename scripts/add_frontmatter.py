import fileinput
import re
from pathlib import Path
from html.parser import HTMLParser

# Cleaning up the MDX files after Pandoc has converted from RST to MDX
# The original files had the registered link (for internal links) at the top of the file
# These needed to be after the frontmatter so the if and elif take care of this
# The rest is removing lots of extra characters from conversion
print('adding frontmatter')

def fix_registered_link(line):
  return line.replace("\\", "").replace("&lt;","<").replace("&gt;",">")

class HtmlDataParser(HTMLParser):
  data = list()

  def handle_data(self, data):
    self.data.append(data)

  def reset(self):
    self.data = list()
    return super(HtmlDataParser, self).reset()

for path in Path('content').rglob('*.mdx'):
  copying = False
  top_url_line = ""
  parser = HtmlDataParser()
  for line in fileinput.input(files=[str(path)], inplace=1, backup=".bak"):
    if line.startswith('# ') and not copying:
      title = line.replace("# ", "").replace("\n", "").replace("`", "").replace("\*", "*")
      parser.feed(title)
      parser.close()
      if len(parser.data):
        title = parser.data[0]
      parser.reset()

      print("---")
      print('title: "' + title + '"')
      print('---')
      print()
      print(top_url_line)
      copying = True
    elif not copying:
      if "registered\_link" in line:
        top_url_line = fix_registered_link(line)
      else:
        continue
    elif line.startswith('##'):
      print(line.replace("`", "").replace("\*", "*").replace("\_", "_"), end="")
    elif "registered\_link" in line:
      print(fix_registered_link(line), end="")
    else:
      print(line.replace("\_", "_").replace("\*", "*"), end="")
