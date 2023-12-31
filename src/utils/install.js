import qqface from '../assets/qqface.png'
import { emoji2string, genString2emoji } from "./util";

const plugins = {
 install(Vue, options) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  const url = options && options.url || qqface
  Vue.prototype.$string2emoji = genString2emoji(url)
  Vue.prototype.$emoji2string = emoji2string
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugins);
}

export default plugins;
