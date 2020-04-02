import fileinput

for line in fileinput.input(inplace=1):
  if line.startswith('# '):
    title = line.replace("# ", "").replace("\n", "")
    print("---")
    print("title:", title, sep=" ")
    print("metaTitle:", title, sep=" ")
    print("metaDescription: description")
    print('---')
  else:
    print(line.replace("\n", ""))
  


  # for i in content/**/*.rst ; do echo "$i" && pandoc $i -f rst -t gfm -o ${i%.*}.mdx ; python3 add_frontmatter.py ${i%.*}.mdx ;done

