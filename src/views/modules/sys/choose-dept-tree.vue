<template>
    <el-dialog
        :visible.sync="visibleSelect"
        :modal="true"
        :title="$t('dept.choosetitle')"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="30%">
        <el-form
            :inline="true"
            size="mini">
            <el-form-item :label="$t('keyword')">
                <el-input v-model="filterText"/>
            </el-form-item>
            <el-form-item>
                <el-button type="default">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-tree
            ref="tree"
            :data="deptList"
            :default-expanded-keys="expandedKeys"
            :props="{ label: 'name', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :highlight-current="true"
            class="filter-tree"
            node-key="id"/>
        <template slot="footer">
            <el-button
                type="default"
                size="mini"
                @click="cancelHandle()">
                {{ $t('cancel') }}
            </el-button>
            <el-button
                type="info"
                size="mini"
                @click="cleanHandle()">
                {{ $t('clear') }}
            </el-button>
            <el-button
                type="primary"
                size="mini"
                @click="commitHandle()">
                {{ $t('confirm') }}
            </el-button>
        </template>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            filterText: '',
            visibleSelect: false,
            callback: null,
            deptList: [],
            expandedKeys: null,
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 获取部门列表
        getDeptList(id) {
            return this.$http.get('/sys/dept/list').then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.deptList = res.data;
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(id);
                    this.expandedKeys = [id];
                });
            }).catch(() => {});
        },
        init(id, callback) {
            this.expandedKeys = null;
            this.visibleSelect = true;
            this.callback = callback;
            this.getDeptList(id);
        },
        cancelHandle() {
            this.visibleSelect = false;
        },
        cleanHandle() {
            if (this.callback) {
                this.callback({});
            }
            this.visibleSelect = false;
        },
        commitHandle() {
            var node = this.$refs.tree.getCurrentNode();
            console.log(node);
            if (!node) {
                this.$message.error(this.$t('dept.chooseerror'));
                return;
            }
            if (this.callback) {
                var deptInfo = {
                    deptId: node.id,
                    deptName: node.name
                };
                this.callback(deptInfo);
            }
            this.visibleSelect = false;
        }
    }
};
</script>
