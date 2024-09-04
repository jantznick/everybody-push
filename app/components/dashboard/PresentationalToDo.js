import React, {forwardRef} from 'react';
import classNames from "classnames";

export const PresentationalToDo = forwardRef(({id, name, status}, ref) => {
  return (
    <div ref={ref}
    className={classNames(
        "task",
        "mt-2",
        "mx-2",
        "rounded",
        "p-2",
        "hover:cursor-pointer",
        { 'line-through': status == 'done' }
    )}
    >{name}</div>
  )
});