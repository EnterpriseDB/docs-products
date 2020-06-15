import React from 'react';

export const filterAndSort = (nodes, url) => {
  return nodes
    .map(node => ({
      ...node.frontmatter,
      ...node.fields,
      items: [],
      itemObj: {},
    }))
    .filter(node => node.path.includes(url))
    .sort((a, b) => {
      if (a.path < b.path) {
        return -1;
      }
      if (a.path > b.path) {
        return 1;
      }
      return 0;
    });
};

export const showFrontmatter = frontmatter => {
  let keys = Object.keys(frontmatter);
  return (
    <>
      {keys.map(key => (
        <div>
          {key}: {frontmatter[key]}
        </div>
      ))}
    </>
  );
};
