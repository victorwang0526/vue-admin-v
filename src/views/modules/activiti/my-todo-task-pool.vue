<template>
    <el-card
        shadow="never"
        class="aui-card--fill">
        <div class="mod-activiti__process">
            <el-form
                :inline="true"
                :model="dataForm"
                @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-input
                        v-model="dataForm.taskName"
                        :placeholder="$t('process.name')"
                        clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getDataList()">
                        {{ $t('query') }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                v-loading="dataListLoading"
                :data="dataList"
                border
                style="width: 100%;"
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle">
                <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50"/>
                <el-table-column
                    :label="$t('process.businessKey')"
                    prop="businessKey"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('process.processDefinitionName')"
                    prop="processDefinitionName"
                    header-align="center"
                    align="center"
                    width="80"/>
                <el-table-column
                    :label="$t('process.startTime')"
                    prop="startTime"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('process.name')"
                    prop="taskName"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('process.createTime')"
                    prop="createTime"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('process.owner')"
                    prop="owner"
                    header-align="center"
                    align="center"
                    width="100"/>
                <el-table-column
                    :label="$t('handle')"
                    fixed="right"
                    header-align="center"
                    align="center"
                    width="150">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="claimTask(scope.row.taskId, scope.row.processDefinitionKey, scope.row.businessKey)">
                            {{ $t('process.claim') }}
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="childHandle(scope.row)">
                            {{ $t('process.viewFlowImgage') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"/>
            <leave-handle-task
                v-if="leaveHandleTaskVisible"
                ref="leaveHandleTask"
                @refreshDataList="getDataList"/>
        </div>
    </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module';
import leaveHandleTask from './leave-handle-task';
import { moduleRoutes } from '@/router';
import qs from 'qs';
export default {
    components: {
        leaveHandleTask
    },
    mixins: [mixinViewModule],
    data() {
        return {
            mixinViewModuleOptions: {
                getDataListURL: '/act/task/page',
                getDataListIsPage: true,
                deleteIsBatch: true,
                deleteIsBatchKey: 'deploymentId'
            },
            dataForm: {
                isRoleGroup: '1',
                taskName: ''
            },
            leaveHandleTaskVisible: false
        };
    },
    methods: {
    // 发起流程
        createProcessInstance(id, key) {
            if (key === 'processleavedemo') {
                this.addOrUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.dataForm.processDefinationId = id;
                    this.$refs.addOrUpdate.init();
                });
            }
        },
        claimTask(taskId, processDefinitionKey, businessKey) {
            var params = qs.stringify({
                'taskId': taskId,
                'businessKey': businessKey
            });
            this.$http.post('/act/task/claim', params).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.$message({
                    message: this.$t('prompt.success'),
                    type: 'success',
                    duration: 500,
                    onClose: () => {
                        this.getDataList();
                    }
                });
            }).catch(() => {});
        },
        // 子级 查看流程图
        childHandle(row) {
            // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
            var routeName = `${this.$route.name}__${row.processInstanceId}`;
            var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0];
            if (route) {
                return this.$router.push({ name: routeName, params: { 'processInstanceId': row.processInstanceId } });
            }
            // 否则: 添加并全局变量保存, 再跳转
            route = {
                path: routeName,
                component: () => import('@/views/modules/activiti/leave-view-flow'),
                name: routeName,
                meta: {
                    ...window.SITE_CONFIG['contentTabDefault'],
                    menuId: this.$route.meta.menuId,
                    title: `${this.$route.meta.title} - ${row.processDefinitionName}`
                }
            };
            this.$router.addRoutes([
                {
                    ...moduleRoutes,
                    name: `main-dynamic__${route.name}`,
                    children: [route]
                }
            ]);
            window.SITE_CONFIG['dynamicRoutes'].push(route);
            this.$router.push({ name: route.name, params: { 'processInstanceId': row.processInstanceId, 'type': row.processDefinitionName } });
        }
    }
};
</script>
