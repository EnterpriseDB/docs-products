from pathlib import Path
import os
import shutil

def numberprefix(int):
  result = str(int) + "_"
  if int < 10:
    result = "0" + result
  return result

class Node:
    def __init__(self, filename):
        self.filename = filename
        self.items = []

def extractToc(readfile):
  appending = False
  toc = []
  tocItems = {}
  for line in readfile.readlines():
    if appending and len(line) > 4 and "::" not in line and "newpage" not in line:
      filename = line.replace(" ", "").replace("\n", "")
      if not filename in tocItems:
        toc.append(Node(filename))
        tocItems[filename] = "1"
    if "maxdepth" in line:
      appending = True
  return toc

def scanNode(path, root):
  g = open(path, "r")
  toc = extractToc(g)
  if len(toc) > 0:
    for idx, item in enumerate(toc):
      item_path = root + item.filename + ".rst"
      subToc = scanNode(item_path, root)
      if len(subToc) > 0:
        toc[idx].items = subToc
  return toc

def countItems(tree):
  total = len(tree.items)
  for leaf in tree.items:
    total += countItems(leaf)
  return total

def printItems(tree, depth):
  print(">" * depth + " " + tree.filename)
  for leaf in tree.items:
    printItems(leaf, depth + 1)

def process_node(node, root_path, result_path, index):
  if len(node.items) == 0:
    source = root_path + node.filename + ".mdx"
    destination = result_path + numberprefix(index) + node.filename + ".mdx"
    dest = shutil.copyfile(source, destination) 
  else:
    folder_path = result_path + numberprefix(index) + node.filename
    os.mkdir(folder_path)
    source = root_path + node.filename + ".mdx"
    destination = folder_path + "/index.mdx"
    dest = shutil.copyfile(source, destination)
    idx = 1
    for sub_node in node.items:
      process_node(sub_node, root_path, folder_path + "/", idx)
      idx += 1

for path in Path('content').rglob('index.rst'):
    root_path = str(path.parents[0]) + '/'
    f = path.open()

    # get top level of ToC
    toc = extractToc(f)

    # get sub-levels of ToC
    for idx, item in enumerate(toc):
      item_path = root_path + item.filename + ".rst"
      subToc = scanNode(item_path, root_path)
      if len(subToc) > 0:
        toc[idx].items = subToc

    # Check to see how many files logged in ToC
    total = len(toc)
    for node in toc:
      printItems(node, 0)
      total += countItems(node)
    print(str(total) + " files logged in ToC")

    result_path = root_path + "result"
    dest_path = result_path + "/" + path.parts[-2]

    # clear out previous results, if any
    if os.path.exists(dest_path):
      shutil.rmtree(dest_path)

    # create build folder, if needed
    try:
      if not os.path.exists(result_path):
        os.mkdir(result_path)
    except OSError:
      print ("Creation of the directory %s failed" % result_path)
    else:
      print ("Successfully created the directory %s " % result_path)

    # create destination folder within build folder
    try:
      os.mkdir(dest_path)
    except OSError:
      print ("Creation of the directory %s failed" % dest_path)
    else:
      print ("Successfully created the directory %s " % dest_path)

    # copy images folder to destination folder
    shutil.copytree(root_path + "images", dest_path + "/images")

    # process nodes in ToC to move mdx files to correct folder in destination folder
    idx = 1
    for node in toc:
      process_node(node, root_path, dest_path + "/", idx)
      idx += 1

    # for item in len(toc:
    #   os.rename(str(path.parents[0]) + "/" + item + ".mdx", str(path.parents[0]) + "/" + numberprefix(idx) + item + ".mdx") 
    #   idx += 1
    # os.rename(str(path.parents[0]) + "/index.mdx", str(path.parents[1]) + "/" + path.parts[-2] + ".mdx") 
    


