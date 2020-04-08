import React from 'react';
import OpenedSvg from '../images/opened';
import ClosedSvg from '../images/closed';
import config from '../../../config';
import Link from '../link';

const TreeNode = ({ className = '', setCollapsed, collapsed, url, title, items, ...rest }) => {
  const isCollapsed = collapsed[url];

  const collapse = e => {
    if (e.key !== 'Tab') {
      setCollapsed(url);
    }
  };

  const hasChildren = items.length !== 0;

  let location;

  if (typeof document != 'undefined') {
    location = document.location;
  }
  const active =
    location && (location.pathname === url || location.pathname === config.gatsby.pathPrefix + url);

  const calculatedClassName = `${className} item ${active ? 'active' : ''}`;

  return (
    <li className={calculatedClassName}>
      {title && (
        <Link to={url}>
          {!config.sidebar.frontLine && title && hasChildren ? (
            <div onClick={collapse} role="button" tabIndex={0} onKeyDown={collapse}>
              {title}
              <button aria-label="collapse" className="collapser">
                {!isCollapsed ? <OpenedSvg /> : <ClosedSvg />}
              </button>
            </div>
          ) : (
            <>{title}</>
          )}
        </Link>
      )}

      {!isCollapsed && hasChildren ? (
        <ul>
          {items.map((item, index) => (
            <TreeNode
              key={item.url + index.toString()}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              {...item}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default TreeNode;
