import Vue from 'vue';
import Element from 'element-ui';
import app from '@/app';
import i18n from '@/i18n';
import router from '@/router';
import store from '@/store';
import '@/icons';
import '@/element-ui/theme/index.css';
import '@/assets/scss/aui.scss';
import http from '@/utils/request';
import mesRadioGroup from '@/components/mes-radio-group';
import mesSelect from '@/components/mes-select';
import mesDeptTree from '@/components/mes-dept-tree';
import mesRegionTree from '@/components/mes-region-tree';
import { hasPermission, getDictLabel } from '@/utils';
import cloneDeep from 'lodash/cloneDeep';

Vue.config.productionTip = false;

Vue.use(Element, {
    size: 'default',
    i18n: (key, value) => i18n.t(key, value)
});

Vue.use(mesRadioGroup);
Vue.use(mesSelect);
Vue.use(mesDeptTree);
Vue.use(mesRegionTree);

// 挂载全局
Vue.prototype.$http = http;
Vue.prototype.$hasPermission = hasPermission;
Vue.prototype.$getDictLabel = getDictLabel;

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state);

new Vue({
    i18n,
    router,
    store,
    render: h => h(app)
}).$mount('#app');
