<template>
    <div>
        <el-input
            v-model="showDeptName"
            :placeholder="placeholder"
            @focus="deptDialog">
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="deptDialog"/>
        </el-input>
        <el-input
            :value="value"
            style="display: none"/>
        <el-dialog
            :visible.sync="visibleDept"
            :modal="false"
            :title="placeholder"
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
                        {{ $t('query') }}
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
                    v-if="query"
                    type="info"
                    size="mini"
                    @click="clearHandle()">
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
    </div>
</template>
<script>
export default {
    name: 'MesDeptTree',
    props: {
        value: [Number, String],
        deptName: String,
        query: Boolean,
        placeholder: String
    },
    data() {
        return {
            filterText: '',
            visibleDept: false,
            deptList: [],
            showDeptName: '',
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
        },
        deptName(val) {
            this.showDeptName = val;
        }
    },
    methods: {
        deptDialog() {
            this.expandedKeys = null;
            if (this.$refs.tree) {
                this.$refs.tree.setCurrentKey(null);
            }
            this.visibleDept = true;
            this.getDeptList(this.value);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
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
        cancelHandle() {
            this.visibleDept = false;
            this.deptList = [];
            this.filterText = '';
        },
        clearHandle() {
            this.$emit('input', '');
            this.$emit('update:deptName', '');
            this.showDeptName = '';
            this.visibleDept = false;
            this.deptList = [];
            this.filterText = '';
        },
        commitHandle() {
            const node = this.$refs.tree.getCurrentNode();
            if (!node) {
                this.$message.error(this.$t('dept.chooseerror'));
                return;
            }
            this.$emit('input', node.id);
            this.$emit('update:deptName', node.name);
            this.showDeptName = node.name;
            this.visibleDept = false;
            this.deptList = [];
            this.filterText = '';
        }
    }
};
</script>
