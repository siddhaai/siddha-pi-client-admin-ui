// utils/disableDevTools.js
import { IS_PRODUCTION } from "./Config";

const disableReactDevTools = () => {
  if (IS_PRODUCTION) {
    // Overwrite `__REACT_DEVTOOLS_GLOBAL_HOOK__` to prevent DevTools from attaching
    if (
      typeof window !== "undefined" &&
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
    }
  }
};

export default disableReactDevTools;
